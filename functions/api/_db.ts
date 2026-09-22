// Central Database & Storage Adapter for IDEA HOME
// Supports Cloudflare KV (Primary, 100% Free, No Credit Card), Supabase REST, Firebase Firestore REST, and D1
// Built to ensure centralized, cross-device persistence across phones, laptops, and browsers

import { Product, Category, CatalogInfo, PriceListInfo, SliderProduct, ContactMessage, CompanyPhoto } from '../../src/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_CATALOG, INITIAL_PRICE_LIST, INITIAL_MESSAGES, INITIAL_COMPANY_PHOTOS } from '../../src/data/initialData';
import { DEFAULT_SLIDER_PRODUCTS } from '../../src/data/sliderProducts';

export type DatabaseProvider = 'kv' | 'imagekit' | 'supabase' | 'firebase' | 'memory';

// In-memory fallback cache for worker runtime
const memoryCache = new Map<string, any>();

export function getDatabaseProvider(env: Env): DatabaseProvider {
  // IDEA HOME uses ImageKit as the only persistent storage
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
    case 'kv': return 'Cloudflare Workers KV (Fast Edge NoSQL - Free)';
    case 'imagekit': return 'ImageKit Cloud Persistent Storage (JSON Cloud CDN)';
    case 'supabase': return 'Supabase PostgreSQL (Cloud Database)';
    case 'firebase': return 'Firebase Firestore (Google Cloud)';
    case 'memory': return 'Worker Memory Cache (Please configure ImageKit or KV)';
  }
}

// Low-level universal Get/Set/Delete operations
async function getStoreData<T>(env: Env, key: string, defaultValue: T): Promise<T> {
  const provider = getDatabaseProvider(env);

  // 1. Cloudflare KV (Primary recommended)
  if (provider === 'kv') {
    const kv = env.KV || env.PRODUCTS_KV;
    if (kv) {
      try {
        const raw = await kv.get(key, 'text');
        if (raw) {
          return JSON.parse(raw);
        }
        await kv.put(key, JSON.stringify(defaultValue));
        return defaultValue;
      } catch (err) {
        console.error(`KV read error for key ${key}:`, err);
      }
    }
  }

  // 2. ImageKit Cloud Storage (Persistent JSON files)
  if (provider === 'imagekit' && env.IMAGEKIT_URL_ENDPOINT) {
    try {
      const fileName = `${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
      const url = `${env.IMAGEKIT_URL_ENDPOINT.replace(/\/$/, '')}/ideahome/data/${fileName}?t=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data !== undefined && data !== null) {
          memoryCache.set(key, data);
          return data as T;
        }
      }
    } catch (err) {
      console.error(`ImageKit read error for ${key}:`, err);
    }
  }

  // 3. Supabase REST API (Free PostgreSQL)
  if (provider === 'supabase' && env.SUPABASE_URL) {
    const apiKey = env.SUPABASE_KEY || (env as any).SUPABASE_ANON_KEY || '';
    try {
      const url = `${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/ideahome_store?key=eq.${encodeURIComponent(key)}&select=data`;
      const res = await fetch(url, {
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const rows = await res.json() as any[];
        if (Array.isArray(rows) && rows.length > 0 && rows[0].data !== undefined) {
          return rows[0].data;
        }
      }
      await setStoreData(env, key, defaultValue);
      return defaultValue;
    } catch (err) {
      console.error(`Supabase read error for ${key}:`, err);
    }
  }

  // 4. Firebase Firestore REST API (Free Google Cloud NoSQL)
  if (provider === 'firebase' && env.FIREBASE_PROJECT_ID) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/ideahome_store/${key}`;
      const res = await fetch(url);
      if (res.ok) {
        const doc = await res.json() as any;
        if (doc?.fields?.data?.stringValue) {
          return JSON.parse(doc.fields.data.stringValue);
        }
      }
      await setStoreData(env, key, defaultValue);
      return defaultValue;
    } catch (err) {
      console.error(`Firebase read error for ${key}:`, err);
    }
  }

  // 5. Memory Cache fallback
  if (memoryCache.has(key)) {
    return memoryCache.get(key);
  }
  memoryCache.set(key, defaultValue);
  return defaultValue;
}

async function setStoreData<T>(env: Env, key: string, value: T): Promise<boolean> {
  const provider = getDatabaseProvider(env);

  // 1. Cloudflare KV
  if (provider === 'kv') {
    const kv = env.KV || env.PRODUCTS_KV;
    if (kv) {
      try {
        await kv.put(key, JSON.stringify(value));
        memoryCache.set(key, value);
        return true;
      } catch (err) {
        console.error(`KV write error for ${key}:`, err);
        return false;
      }
    }
  }

  // 2. ImageKit Cloud Storage
  if (provider === 'imagekit' && env.IMAGEKIT_PRIVATE_KEY) {
    try {
      const fileName = `${key.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
      const jsonString = JSON.stringify(value, null, 2);

      let base64Data: string;
      if (typeof Buffer !== 'undefined') {
        base64Data = Buffer.from(jsonString, 'utf-8').toString('base64');
      } else {
        const bytes = new TextEncoder().encode(jsonString);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64Data = btoa(binary);
      }

      const form = new FormData();
      form.append('file', base64Data);
      form.append('fileName', fileName);
      form.append('folder', '/ideahome/data');
      form.append('useUniqueFileName', 'false');

      const authHeader = 'Basic ' + (typeof Buffer !== 'undefined'
        ? Buffer.from(`${env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')
        : btoa(`${env.IMAGEKIT_PRIVATE_KEY}:`));

      const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: { Authorization: authHeader },
        body: form
      });

      if (res.ok) {
        memoryCache.set(key, value);

        // Purge ImageKit's CDN edge cache for this file immediately, otherwise
        // some edge nodes can keep serving the previous version for a while
        // even though the origin file was just overwritten.
        if (env.IMAGEKIT_URL_ENDPOINT) {
          try {
            const purgeUrl = `${env.IMAGEKIT_URL_ENDPOINT.replace(/\/$/, '')}/ideahome/data/${fileName}`;
            await fetch('https://api.imagekit.io/v1/files/purge', {
              method: 'POST',
              headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ url: purgeUrl })
            });
          } catch (purgeErr) {
            console.error(`ImageKit cache purge error for ${key}:`, purgeErr);
          }
        }

        return true;
      } else {
        const errText = await res.text().catch(() => '');
        console.error(`ImageKit write error (${res.status}) for ${key}:`, errText);
        return false;
      }
    } catch (err) {
      console.error(`ImageKit write exception for ${key}:`, err);
      return false;
    }
  }

  // 3. Supabase REST API
  if (provider === 'supabase' && env.SUPABASE_URL) {
    const apiKey = env.SUPABASE_KEY || (env as any).SUPABASE_ANON_KEY || '';
    try {
      const url = `${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/ideahome_store`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          key,
          data: value,
          updated_at: new Date().toISOString()
        })
      });
      if (res.ok) {
        memoryCache.set(key, value);
        return true;
      }
    } catch (err) {
      console.error(`Supabase write error for ${key}:`, err);
    }
  }

  // 4. Firebase Firestore REST API
  if (provider === 'firebase' && env.FIREBASE_PROJECT_ID) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/ideahome_store/${key}?updateMask.fieldPaths=data`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            data: { stringValue: JSON.stringify(value) }
          }
        })
      });
      if (res.ok) {
        memoryCache.set(key, value);
        return true;
      }
    } catch (err) {
      console.error(`Firebase write error for ${key}:`, err);
    }
  }

  // 5. Memory Cache
  memoryCache.set(key, value);
  return true;
}

export async function deleteStoreData(env: Env, key: string): Promise<boolean> {
  const provider = getDatabaseProvider(env);
  memoryCache.delete(key);

  if (provider === 'kv') {
    const kv = env.KV || env.PRODUCTS_KV;
    if (kv) {
      try {
        await kv.delete(key);
        return true;
      } catch (err) {
        console.error(`KV delete error for ${key}:`, err);
      }
    }
  }

  if (provider === 'imagekit' && env.IMAGEKIT_PRIVATE_KEY) {
    try {
      await setStoreData(env, key, {});
      return true;
    } catch (err) {
      console.error(`ImageKit delete error for ${key}:`, err);
    }
  }

  if (provider === 'supabase' && env.SUPABASE_URL) {
    const apiKey = env.SUPABASE_KEY || (env as any).SUPABASE_ANON_KEY || '';
    try {
      await fetch(`${env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/ideahome_store?key=eq.${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: {
          'apikey': apiKey,
          'Authorization': `Bearer ${apiKey}`,
        }
      });
      return true;
    } catch (err) {
      console.error(`Supabase delete error for ${key}:`, err);
    }
  }

  if (provider === 'firebase' && env.FIREBASE_PROJECT_ID) {
    try {
      await fetch(`https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/ideahome_store/${key}`, {
        method: 'DELETE'
      });
      return true;
    } catch (err) {
      console.error(`Firebase delete error for ${key}:`, err);
    }
  }

  return true;
}

// ==========================================
// 1. PRODUCTS API
// ==========================================
const KEY_PRODUCTS = 'ideahome:products';

export async function getProducts(env: Env): Promise<Product[]> {
  const list = await getStoreData<Product[]>(env, KEY_PRODUCTS, INITIAL_PRODUCTS);
  return Array.isArray(list) ? list : INITIAL_PRODUCTS;
}

export async function getProductById(env: Env, id: string): Promise<Product | null> {
  const products = await getProducts(env);
  return products.find(p => p.id === id) || null;
}

export async function saveProduct(env: Env, productData: Partial<Product> & { name: string; category: string; price: number }): Promise<Product> {
  const products = await getProducts(env);
  const now = new Date().toISOString().split('T')[0];

  const existingIndex = productData.id ? products.findIndex(p => p.id === productData.id) : -1;
  let targetProduct: Product;

  if (existingIndex >= 0) {
    // Update
    targetProduct = {
      ...products[existingIndex],
      ...productData,
      updatedAt: now
    };
    products[existingIndex] = targetProduct;
  } else {
    // Create new
    const newId = productData.id || `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    targetProduct = {
      id: newId,
      name: productData.name,
      category: productData.category,
      price: Number(productData.price) || 0,
      currency: 'IRT',
      shortDescription: productData.shortDescription || '',
      fullDescription: productData.fullDescription || productData.shortDescription || '',
      images: Array.isArray(productData.images) ? productData.images : [],
      specs: productData.specs && typeof productData.specs === 'object' ? productData.specs : {},
      inStock: productData.inStock !== false,
      isFeatured: Boolean(productData.isFeatured),
      code: productData.code || `IH-${Date.now().toString().slice(-4)}`,
      createdAt: productData.createdAt || now,
      updatedAt: now
    };
    products.unshift(targetProduct);
  }

  await setStoreData(env, KEY_PRODUCTS, products);
  return targetProduct;
}

export async function deleteProduct(env: Env, id: string): Promise<boolean> {
  const products = await getProducts(env);
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) return false;
  await setStoreData(env, KEY_PRODUCTS, filtered);
  return true;
}

// ==========================================
// 2. CATEGORIES API
// ==========================================
const KEY_CATEGORIES = 'ideahome:categories';

export async function getCategories(env: Env): Promise<Category[]> {
  const list = await getStoreData<Category[]>(env, KEY_CATEGORIES, INITIAL_CATEGORIES);
  return Array.isArray(list) ? list : INITIAL_CATEGORIES;
}

export async function saveCategory(env: Env, categoryData: Partial<Category> & { name: string }): Promise<Category> {
  const categories = await getCategories(env);
  const trimmedName = categoryData.name.trim();

  const existingIndex = categories.findIndex(c => (categoryData.id && c.id === categoryData.id) || c.name.toLowerCase() === trimmedName.toLowerCase());
  let targetCategory: Category;

  if (existingIndex >= 0) {
    targetCategory = {
      ...categories[existingIndex],
      ...categoryData,
      name: trimmedName,
      description: categoryData.description !== undefined ? categoryData.description : categories[existingIndex].description
    };
    categories[existingIndex] = targetCategory;
  } else {
    targetCategory = {
      id: categoryData.id || `cat_${Date.now()}`,
      name: trimmedName,
      description: categoryData.description || '',
      images: categoryData.images || [],
      catalogUrl: categoryData.catalogUrl || '',
      catalogTitle: categoryData.catalogTitle || '',
      catalogSize: categoryData.catalogSize || '',
      catalogUpdatedAt: categoryData.catalogUpdatedAt || '',
      ...categoryData
    };
    categories.push(targetCategory);
  }

  await setStoreData(env, KEY_CATEGORIES, categories);
  return targetCategory;
}

export async function deleteCategory(env: Env, id: string): Promise<boolean> {
  const categories = await getCategories(env);
  const filtered = categories.filter(c => c.id !== id && c.name !== id);
  if (filtered.length === categories.length) return false;
  await setStoreData(env, KEY_CATEGORIES, filtered);
  return true;
}

// ==========================================
// 2.1 COMPANY PHOTOS (FACTORY & OFFICE)
// ==========================================
const KEY_COMPANY_PHOTOS = 'ideahome:company_photos';

export async function getCompanyPhotosStore(env: Env): Promise<CompanyPhoto[]> {
  const list = await getStoreData<CompanyPhoto[]>(env, KEY_COMPANY_PHOTOS, INITIAL_COMPANY_PHOTOS);
  const valid = Array.isArray(list) ? list : INITIAL_COMPANY_PHOTOS;
  return [...valid].sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function saveCompanyPhotosStore(env: Env, photos: CompanyPhoto[]): Promise<CompanyPhoto[]> {
  await setStoreData(env, KEY_COMPANY_PHOTOS, photos);
  return photos;
}

export async function saveSingleCompanyPhoto(env: Env, photo: Partial<CompanyPhoto>): Promise<CompanyPhoto> {
  const photos = await getCompanyPhotosStore(env);
  let savedPhoto: CompanyPhoto;
  if (photo.id) {
    const idx = photos.findIndex(p => p.id === photo.id);
    if (idx >= 0) {
      savedPhoto = { ...photos[idx], ...photo };
      photos[idx] = savedPhoto;
    } else {
      savedPhoto = {
        id: photo.id,
        url: photo.url || '',
        title: photo.title || 'تصویر کارخانه و دفتر',
        category: photo.category || 'factory',
        description: photo.description || '',
        order: photo.order !== undefined ? photo.order : photos.length + 1,
        createdAt: photo.createdAt || new Date().toLocaleDateString('fa-IR'),
        ...photo
      };
      photos.push(savedPhoto);
    }
  } else {
    savedPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      url: photo.url || '',
      title: photo.title || 'تصویر کارخانه و دفتر',
      category: photo.category || 'factory',
      description: photo.description || '',
      order: photo.order !== undefined ? photo.order : photos.length + 1,
      createdAt: photo.createdAt || new Date().toLocaleDateString('fa-IR'),
      ...photo
    };
    photos.push(savedPhoto);
  }
  await setStoreData(env, KEY_COMPANY_PHOTOS, photos);
  return savedPhoto;
}

export async function deleteCompanyPhotoStore(env: Env, id: string): Promise<boolean> {
  const photos = await getCompanyPhotosStore(env);
  const filtered = photos.filter(p => p.id !== id);
  if (filtered.length === photos.length) return false;
  await setStoreData(env, KEY_COMPANY_PHOTOS, filtered);
  return true;
}

// ==========================================
// 3. CATALOG API
// ==========================================
const KEY_CATALOG = 'ideahome:catalog';

export async function getCatalogInfo(env: Env): Promise<CatalogInfo> {
  const info = await getStoreData<CatalogInfo>(env, KEY_CATALOG, INITIAL_CATALOG);
  return (info && info.fileUrl) ? info : INITIAL_CATALOG;
}

export async function saveCatalogInfo(env: Env, updates: Partial<CatalogInfo>): Promise<CatalogInfo> {
  const current = await getCatalogInfo(env);
  const updated: CatalogInfo = {
    ...current,
    ...updates,
    updatedAt: updates.updatedAt || new Date().toLocaleDateString('fa-IR')
  };
  await setStoreData(env, KEY_CATALOG, updated);
  return updated;
}

// ==========================================
// 3.5. PRICE LIST API
// ==========================================
const KEY_PRICE_LIST = 'ideahome:price-list';

export async function getPriceListInfo(env: Env): Promise<PriceListInfo> {
  const info = await getStoreData<PriceListInfo>(env, KEY_PRICE_LIST, INITIAL_PRICE_LIST);
  return (info && info.fileUrl) ? info : INITIAL_PRICE_LIST;
}

export async function savePriceListInfo(env: Env, updates: Partial<PriceListInfo>): Promise<PriceListInfo> {
  const current = await getPriceListInfo(env);
  const updated: PriceListInfo = {
    ...current,
    ...updates,
    updatedAt: updates.updatedAt || new Date().toLocaleDateString('fa-IR')
  };
  await setStoreData(env, KEY_PRICE_LIST, updated);
  return updated;
}

// ==========================================
// 4. SLIDER API
// ==========================================
const KEY_SLIDER = 'ideahome:slider';

export async function getSliderItems(env: Env, includeInactive = false): Promise<SliderProduct[]> {
  const items = await getStoreData<SliderProduct[]>(env, KEY_SLIDER, DEFAULT_SLIDER_PRODUCTS);
  const validItems = Array.isArray(items) ? items : DEFAULT_SLIDER_PRODUCTS;
  if (includeInactive) return validItems;
  return validItems.filter(item => item.active !== false);
}

export async function saveSliderItems(env: Env, items: SliderProduct[]): Promise<SliderProduct[]> {
  const sanitized = items.map((item, index) => ({
    id: typeof item.id === 'number' ? item.id : Number(item.id) || (index + 1),
    image: item.image || '',
    imageKey: item.imageKey || undefined,
    code: item.code || `IH-${index + 1}`,
    title: item.title || 'محصول ویژه ویترین',
    category: item.category || 'محصولات آیدیا هوم',
    badge: item.badge || undefined,
    description: item.description || undefined,
    order: item.order !== undefined ? Number(item.order) : (index + 1),
    active: item.active !== false
  }));

  await setStoreData(env, KEY_SLIDER, sanitized);
  return sanitized;
}

// ==========================================
// 5. CONTACT MESSAGES API
// ==========================================
const KEY_MESSAGES = 'ideahome:messages';

export async function getContactMessages(env: Env): Promise<ContactMessage[]> {
  const msgs = await getStoreData<ContactMessage[]>(env, KEY_MESSAGES, INITIAL_MESSAGES);
  return Array.isArray(msgs) ? msgs : INITIAL_MESSAGES;
}

export async function saveContactMessage(env: Env, messageData: Omit<ContactMessage, 'id' | 'date' | 'status'>): Promise<ContactMessage> {
  const msgs = await getContactMessages(env);
  const newMsg: ContactMessage = {
    ...messageData,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    date: new Date().toLocaleDateString('fa-IR'),
    status: 'unread'
  };

  msgs.unshift(newMsg);
  await setStoreData(env, KEY_MESSAGES, msgs);
  return newMsg;
}

export async function updateMessageStatus(env: Env, id: string, status: 'read' | 'unread'): Promise<boolean> {
  const msgs = await getContactMessages(env);
  const target = msgs.find(m => m.id === id);
  if (!target) return false;
  target.status = status;
  await setStoreData(env, KEY_MESSAGES, msgs);
  return true;
}

// ==========================================
// 6. SITE CONTENT VISUAL EDITOR API
// ==========================================

const KEY_CONTENT = 'ideahome:site_content';


// دریافت کل محتوای سایت
export async function getSiteContentStore(
  env: Env
): Promise<Record<string, string>> {

  return await getStoreData<Record<string, string>>(
    env,
    KEY_CONTENT,
    {}
  );

}



// ذخیره و بروزرسانی محتوا
// فقط کلیدهای ارسال شده تغییر می‌کنند
// بقیه اطلاعات حفظ می‌شوند

export async function saveSiteContentStore(
  env: Env,
  content: Record<string, string>
): Promise<Record<string, string>> {


  const current =
    await getSiteContentStore(env);



  const mergedContent: Record<string,string> = {
    ...current,
    ...content
  };



  const success =
    await setStoreData(
      env,
      KEY_CONTENT,
      mergedContent
    );



  if(!success){

    throw new Error(
      'ذخیره‌سازی محتوا در فضای ابری ImageKit با خطا مواجه شد.'
    );

  }



  return mergedContent;

}




// حذف کامل همه محتوای قابل ویرایش

export async function resetSiteContentStore(
  env: Env
): Promise<boolean> {


  const success =
    await deleteStoreData(
      env,
      KEY_CONTENT
    );



  if(!success){

    throw new Error(
      'بازنشانی محتوای سایت انجام نشد.'
    );

  }



  return true;

}





// حذف فقط یک فیلد خاص از پنل مدیریت
// مثال:
// hero.title
// about.subtitle

export async function deleteSiteContentKey(
  env: Env,
  key: string
): Promise<boolean> {


  const current =
    await getSiteContentStore(env);



  if(key in current){

    delete current[key];

  }



  const success =
    await setStoreData(
      env,
      KEY_CONTENT,
      current
    );



  if(!success){

    throw new Error(
      'حذف محتوای انتخاب شده از فضای ابری انجام نشد.'
    );

  }



  return true;

}
