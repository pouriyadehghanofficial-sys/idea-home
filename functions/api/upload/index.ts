import { requireAdmin } from "../../_auth";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Cache-Control": "no-store",
};


function json(data:any,status=200){
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers:{
        ...corsHeaders,
        "Content-Type":"application/json"
      }
    }
  );
}


export async function onRequestOptions(){

  return new Response(null,{
    status:204,
    headers:corsHeaders
  });

}



export async function onRequestPost(context:any){

 const {request,env}=context;


 const auth=await requireAdmin(request,env);

 if(!auth.authenticated){
   return auth.errorResponse!;
 }


 const privateKey=env.IMAGEKIT_PRIVATE_KEY;

 if(!privateKey){
   return json({
    success:false,
    error:"IMAGEKIT_PRIVATE_KEY missing"
   },500);
 }



 try{


 const form=await request.formData();


 const file=form.get("file");


 if(!file){
   return json({
    success:false,
    error:"file missing"
   },400);
 }



 const fileName=
 form.get("fileName") ||
 (file as any).name ||
 "upload.pdf";


 const folder=
 form.get("folder") ||
 "/ideahome/uploads";



 const arrayBuffer=
 await (file as Blob).arrayBuffer();



 const bytes=new Uint8Array(arrayBuffer);


 let binary="";


 const chunk=8192;


 for(let i=0;i<bytes.length;i+=chunk){

   binary+=String.fromCharCode(
    ...bytes.subarray(i,i+chunk)
   );

 }


 const base64=btoa(binary);



 const body=new FormData();


 body.append(
  "file",
  base64
 );


 body.append(
  "fileName",
  String(fileName)
 );


 body.append(
  "folder",
  String(folder)
 );


 body.append(
  "useUniqueFileName",
  "true"
 );



 const response=await fetch(
 "https://upload.imagekit.io/api/v1/files/upload",
 {
 method:"POST",
 headers:{
  Authorization:
  "Basic "+btoa(privateKey+":")
 },
 body
 });



 const data:any=
 await response.json();



 if(!response.ok){

 return json({
  success:false,
  error:"ImageKit upload failed",
  details:data
 },500);

 }



 return json({

 success:true,

 url:data.url,

 fileId:data.fileId,

 name:data.name,

 size:data.size

 });


 }
 catch(e:any){

 return json({

 success:false,

 error:e.message

 },500);


 }


}



export async function onRequestDelete(context:any){

 const {request,env}=context;


 const auth=await requireAdmin(request,env);

 if(!auth.authenticated){
   return auth.errorResponse!;
 }



 const id=
 new URL(request.url)
 .searchParams
 .get("fileId");


 if(!id){

 return json({
 success:false,
 error:"fileId required"
 },400);

 }



 const result=
 await fetch(
 `https://api.imagekit.io/v1/files/${id}`,
 {
 method:"DELETE",
 headers:{
 Authorization:
 "Basic "+btoa(
 env.IMAGEKIT_PRIVATE_KEY+":"
 )
 }
 });



 return json({

 success:result.ok,

 fileId:id

 });


}
