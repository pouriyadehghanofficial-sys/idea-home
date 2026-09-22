// functions/api/upload/index.ts
// Cloudflare Pages Function
// Upload PDF/Image files to ImageKit

import { requireAdmin } from "../_auth";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "*",
};



export const onRequestOptions: PagesFunction = async () => {

  return new Response(null,{
    status:204,
    headers:corsHeaders
  });

};



export const onRequestPost: PagesFunction = async ({
  request,
  env
}) => {


  try {


    const auth = await requireAdmin(request,env);

    if(!auth.authenticated){
      return auth.errorResponse!;
    }



    const privateKey =
      env.IMAGEKIT_PRIVATE_KEY?.trim();



    if(!privateKey){

      return Response.json(
        {
          success:false,
          error:"IMAGEKIT_PRIVATE_KEY موجود نیست"
        },
        {
          status:500,
          headers:corsHeaders
        }
      );

    }




    const form =
      await request.formData();



    const file =
      form.get("file") as File;



    if(!file){

      return Response.json(
        {
          success:false,
          error:"فایل ارسال نشده"
        },
        {
          status:400,
          headers:corsHeaders
        }
      );

    }



    if(file.size > 50*1024*1024){

      return Response.json(
        {
          success:false,
          error:"حجم فایل بیشتر از 50MB است"
        },
        {
          status:413,
          headers:corsHeaders
        }
      );

    }




    const fileName =
      file.name || "upload.pdf";



    const folder =
      form.get("folder")?.toString()
      ||
      (
        fileName
        .toLowerCase()
        .includes("price")
        ?
        "/ideahome/price-list"
        :
        "/ideahome/catalog"
      );





    const arrayBuffer =
      await file.arrayBuffer();



    const bytes =
      new Uint8Array(arrayBuffer);



    let binary="";

    const chunk=8192;


    for(
      let i=0;
      i<bytes.length;
      i+=chunk
    ){

      binary += String.fromCharCode(
        ...bytes.subarray(
          i,
          i+chunk
        )
      );

    }



    const base64 =
      btoa(binary);




    const uploadForm =
      new FormData();



    uploadForm.append(
      "file",
      base64
    );


    uploadForm.append(
      "fileName",
      fileName
    );


    uploadForm.append(
      "folder",
      folder
    );


    uploadForm.append(
      "useUniqueFileName",
      "true"
    );





    const response =
      await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method:"POST",

          headers:{
            Authorization:
            "Basic "+
            btoa(
              privateKey+":"
            )
          },

          body:uploadForm
        }
      );




    const result =
      await response.json();




    if(!response.ok){

      console.error(
        "ImageKit error",
        result
      );


      return Response.json(
        {
          success:false,
          error:"خطا در ImageKit",
          details:result
        },
        {
          status:502,
          headers:corsHeaders
        }
      );

    }




    return Response.json(
      {
        success:true,

        url:
        result.url,

        fileId:
        result.fileId,

        name:
        result.name,

        size:
        result.size

      },
      {
        status:200,
        headers:corsHeaders
      }
    );




  }catch(error:any){


    console.error(
      "UPLOAD ERROR",
      error
    );



    return Response.json(
      {
        success:false,
        error:
        error.message ||
        "Upload failed"
      },
      {
        status:500,
        headers:corsHeaders
      }
    );

  }


};






export const onRequestDelete: PagesFunction = async ({
 request,
 env
})=>{


 try{


  const auth =
    await requireAdmin(
      request,
      env
    );


  if(!auth.authenticated){

    return auth.errorResponse!;

  }



  const fileId =
    new URL(request.url)
    .searchParams
    .get("fileId");



  if(!fileId){

    return Response.json(
      {
        success:false,
        error:"fileId required"
      },
      {
        status:400,
        headers:corsHeaders
      }
    );

  }



  const result =
    await fetch(
      `https://api.imagekit.io/v1/files/${fileId}`,
      {

        method:"DELETE",

        headers:{
          Authorization:
          "Basic "+
          btoa(
            env.IMAGEKIT_PRIVATE_KEY+":"
          )
        }

      }
    );




  return Response.json(
    {
      success:
      result.ok
    },
    {
      headers:corsHeaders
    }
  );



 }catch(e:any){


  return Response.json(
    {
      success:false,
      error:e.message
    },
    {
      status:500,
      headers:corsHeaders
    }
  );


}



};
