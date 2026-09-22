// Central Database & Storage Adapter for IDEA HOME
// KV Primary Storage + ImageKit Media Fallback

import { Product, Category, CatalogInfo, PriceListInfo, SliderProduct, ContactMessage, CompanyPhoto } from '../../src/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_CATALOG, INITIAL_PRICE_LIST, INITIAL_MESSAGES, INITIAL_COMPANY_PHOTOS } from '../../src/data/initialData';
import { DEFAULT_SLIDER_PRODUCTS } from '../../src/data/sliderProducts';

export type DatabaseProvider = 'kv' | 'imagekit' | 'supabase' | 'firebase' | 'memory';

// Worker runtime cache
const memoryCache = new Map<string, any>();


// ==========================================
// STORAGE PROVIDER
// ==========================================

export function getDatabaseProvider(env: Env): DatabaseProvider {

  // اولویت اول: Cloudflare KV
  if (env.KV || env.PRODUCTS_KV) {
    return 'kv';
  }

  // fallback: ImageKit JSON storage
  if (
    env.IMAGEKIT_PRIVATE_KEY &&
    env.IMAGEKIT_URL_ENDPOINT
  ) {
    return 'imagekit';
  }

  return 'memory';
}


export function getDatabaseProviderName(env: Env): string {

  const provider = getDatabaseProvider(env);

  switch (provider) {
    case 'kv':
      return 'Cloudflare Workers KV';

    case 'imagekit':
      return 'ImageKit JSON Storage';

    case 'supabase':
      return 'Supabase PostgreSQL';

    case 'firebase':
      return 'Firebase Firestore';

    default:
      return 'Worker Memory Cache';
  }
}



// ==========================================
// GET DATA
// ==========================================

async function getStoreData<T>(
  env: Env,
  key: string,
  defaultValue: T
): Promise<T> {


  const provider = getDatabaseProvider(env);



  // -----------------------------
  // 1. CLOUDFLARE KV
  // -----------------------------

  if (provider === 'kv') {

    const kv = env.KV || env.PRODUCTS_KV;

    if (kv) {

      try {

        const raw = await kv.get(key, 'text');

        if (raw) {

          const data = JSON.parse(raw);

          memoryCache.set(key, data);

          return data;

        }


        await kv.put(
          key,
          JSON.stringify(defaultValue)
        );


        return defaultValue;


      } catch (err) {

        console.error(
          `KV read error ${key}:`,
          err
        );

      }

    }

  }




  // -----------------------------
  // 2. IMAGEKIT FALLBACK
  // -----------------------------

  if (
    provider === 'imagekit' &&
    env.IMAGEKIT_URL_ENDPOINT
  ) {


    try {


      const fileName =
        `${key.replace(/[^a-zA-Z0-9_-]/g,'_')}.json`;


      const url =
        `${env.IMAGEKIT_URL_ENDPOINT.replace(/\/$/,'')}/ideahome/data/${fileName}`;


      const res = await fetch(
        url,
        {
          headers:{
            'Cache-Control':'no-cache'
          }
        }
      );


      if (res.ok) {

        const data = await res.json();

        memoryCache.set(
          key,
          data
        );

        return data as T;

      }


    } catch(err){

      console.error(
        `ImageKit read error ${key}:`,
        err
      );

    }

  }




  // -----------------------------
  // MEMORY FALLBACK
  // -----------------------------

  if(memoryCache.has(key)){

    return memoryCache.get(key);

  }


  memoryCache.set(
    key,
    defaultValue
  );


  return defaultValue;

}






// ==========================================
// SAVE DATA
// ==========================================

async function setStoreData<T>(
  env: Env,
  key:string,
  value:T
):Promise<boolean>{


  const provider =
    getDatabaseProvider(env);



  // -----------------------------
  // 1. CLOUDFLARE KV
  // -----------------------------

  if(provider === 'kv'){


    const kv =
      env.KV || env.PRODUCTS_KV;


    if(kv){

      try{


        await kv.put(
          key,
          JSON.stringify(value)
        );


        memoryCache.set(
          key,
          value
        );


        return true;


      }catch(err){


        console.error(
          `KV write error ${key}:`,
          err
        );


        return false;

      }

    }

  }




  // -----------------------------
  // 2. IMAGEKIT FALLBACK
  // -----------------------------

  if(
    provider === 'imagekit' &&
    env.IMAGEKIT_PRIVATE_KEY
  ){


    try{


      const fileName =
        `${key.replace(/[^a-zA-Z0-9_-]/g,'_')}.json`;



      const json =
        JSON.stringify(
          value,
          null,
          2
        );



      const bytes =
        new TextEncoder()
        .encode(json);



      let binary='';


      for(
        let i=0;
        i<bytes.length;
        i++
      ){

        binary +=
          String.fromCharCode(
            bytes[i]
          );

      }



      const base64 =
        btoa(binary);



      const form =
        new FormData();



      form.append(
        'file',
        base64
      );


      form.append(
        'fileName',
        fileName
      );


      form.append(
        'folder',
        '/ideahome/data'
      );


      form.append(
        'useUniqueFileName',
        'false'
      );



      const authHeader =
        'Basic ' +
        btoa(
          `${env.IMAGEKIT_PRIVATE_KEY}:`
        );



      const res =
        await fetch(
          'https://upload.imagekit.io/api/v1/files/upload',
          {
            method:'POST',
            headers:{
              Authorization:authHeader
            },
            body:form
          }
        );



      if(res.ok){


        memoryCache.set(
          key,
          value
        );


        return true;


      }


      console.error(
        'ImageKit save failed:',
        await res.text()
      );


    }catch(err){

      console.error(
        'ImageKit write error:',
        err
      );

    }

  }



  // fallback memory

  memoryCache.set(
    key,
    value
  );


  return true;

}

// ==========================================
// DELETE DATA
// ==========================================

export async function deleteStoreData(
  env: Env,
  key: string
): Promise<boolean> {

  const provider = getDatabaseProvider(env);

  memoryCache.delete(key);


  // KV
  if(provider === 'kv'){

    const kv = env.KV || env.PRODUCTS_KV;

    if(kv){

      try{

        await kv.delete(key);

        return true;

      }catch(err){

        console.error(
          'KV delete error:',
          err
        );

      }

    }

  }



  // ImageKit fallback
  if(
    provider === 'imagekit' &&
    env.IMAGEKIT_PRIVATE_KEY
  ){

    try{

      await setStoreData(
        env,
        key,
        {}
      );

      return true;


    }catch(err){

      console.error(
        'ImageKit delete error:',
        err
      );

    }

  }


  return true;

}





// ==========================================
// PRODUCTS
// ==========================================

const KEY_PRODUCTS =
  'ideahome:products';



export async function getProducts(
  env: Env
): Promise<Product[]> {


  const list =
    await getStoreData<Product[]>(
      env,
      KEY_PRODUCTS,
      INITIAL_PRODUCTS
    );


  return Array.isArray(list)
    ? list
    : INITIAL_PRODUCTS;

}



export async function saveProduct(
  env: Env,
  productData:
  Partial<Product> &
  {
    name:string;
    category:string;
    price:number;
  }

):Promise<Product>{


  const products =
    await getProducts(env);


  const now =
    new Date()
    .toISOString()
    .split('T')[0];



  const index =
    productData.id
      ? products.findIndex(
          p=>p.id===productData.id
        )
      : -1;



  let product:Product;



  if(index>=0){


    product={
      ...products[index],
      ...productData,
      updatedAt:now
    };


    products[index]=product;


  }else{


    product={

      id:
        productData.id ||
        `prod_${Date.now()}`,

      name:
        productData.name,

      category:
        productData.category,

      price:
        Number(productData.price)||0,

      currency:'IRT',

      shortDescription:
        productData.shortDescription||'',

      fullDescription:
        productData.fullDescription||'',

      images:
        productData.images||[],

      specs:
        productData.specs||{},

      inStock:true,

      isFeatured:
        Boolean(productData.isFeatured),

      code:
        productData.code ||
        `IH-${Date.now()}`,

      createdAt:now,

      updatedAt:now

    };


    products.unshift(product);

  }



  await setStoreData(
    env,
    KEY_PRODUCTS,
    products
  );


  return product;

}





export async function deleteProduct(
  env:Env,
  id:string
):Promise<boolean>{


  const products =
    await getProducts(env);


  const filtered =
    products.filter(
      p=>p.id!==id
    );


  if(filtered.length===products.length)
    return false;



  await setStoreData(
    env,
    KEY_PRODUCTS,
    filtered
  );


  return true;

}







// ==========================================
// CATEGORIES
// ==========================================

const KEY_CATEGORIES =
  'ideahome:categories';



export async function getCategories(
  env:Env
):Promise<Category[]>{


  const list =
    await getStoreData<Category[]>(
      env,
      KEY_CATEGORIES,
      INITIAL_CATEGORIES
    );


  return Array.isArray(list)
    ? list
    : INITIAL_CATEGORIES;

}




export async function saveCategory(
  env:Env,
  data:
  Partial<Category>&
  {
    name:string
  }

):Promise<Category>{


  const categories =
    await getCategories(env);


  const name =
    data.name.trim();



  const index =
    categories.findIndex(
      c=>
      (data.id && c.id===data.id) ||
      c.name.toLowerCase()===
      name.toLowerCase()
    );



  let category:Category;



  if(index>=0){


    category={
      ...categories[index],
      ...data,
      name
    };


    categories[index]=category;


  }else{


    category={

      id:
        data.id ||
        `cat_${Date.now()}`,

      name,

      description:
        data.description||'',

      images:
        data.images||[],

      catalogUrl:
        data.catalogUrl||'',

      catalogTitle:
        data.catalogTitle||''

    };

    categories.push(category);

  }



  await setStoreData(
    env,
    KEY_CATEGORIES,
    categories
  );


  return category;

}





export async function deleteCategory(
  env:Env,
  id:string
):Promise<boolean>{


  const categories =
    await getCategories(env);


  const filtered =
    categories.filter(
      c=>c.id!==id
    );


  await setStoreData(
    env,
    KEY_CATEGORIES,
    filtered
  );


  return true;

}
