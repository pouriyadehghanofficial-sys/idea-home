// Central Database & Storage Adapter for IDEA HOME
// Supports Cloudflare KV (Primary, 100% Free, No Credit Card), Supabase REST, Firebase Firestore REST, and D1
// Built to ensure centralized, cross-device persistence across phones, laptops, and browsers

import { Product, Category, CatalogInfo, SliderProduct, ContactMessage } from '../../src/types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_CATALOG, INITIAL_MESSAGES } from '../../src/data/initialData';
import { DEFAULT_SLIDER_PRODUCTS } from '../../src/data/sliderProducts';

export type DatabaseProvider = 'kv' | 'supabase' | 'firebase' | 'd1' | 'memory';

// In-memory fallback cache for worker runtime
const memoryCache = new Map<string, any>();

export function getDatabaseProvider(env: Env): DatabaseProvider {
  if (env.KV || env.PRODUCTS_KV) return 'kv';
  if (env.SUPABASE_URL && (env.SUPABASE_KEY || (env as any).SUPABASE_ANON_KEY)) return 'supabase';
  if (env.FIREBASE_PROJECT_ID) return 'firebase';
  if (env.DB) return 'd1';
  return 'memory';
}

export function getDatabaseProviderName(env: Env): string {
  const provider = getDatabaseProvider(env);
  switch (provider) {
    case 'kv': return 'Cloudflare Workers KV (Fast Edge NoSQL - Free)';
    case 'supabase': return 'Supabase PostgreSQL (Cloud Database)';
    case 'firebase': return 'Firebase Firestore (Google Cloud)';
    case 'd1': return 'Cloudflare D1 (SQLite Edge)';
    case 'memory': return 'Worker Memory Cache (Please bind Cloudflare KV in Pages settings)';
  }
}

// Low-level universal Get/Set/Delete operations
async function getStoreData<T>(env: Env, key: string, defaultValue: T): Promise<T> {
  const provider = getDatabaseProvider(env);

  // 1. Cloudflare KV (Primary recommended, 100% free with no credit card)
  if (provider === 'kv') {
    const kv = env.KV || env.PRODUCTS_KV;
    if (kv) {
      try {
        const raw = await kv.get(key, 'text');
        if (raw) {
          return JSON.parse(raw);
        }
        // Seed default value into KV so future reads are populated
        await kv.put(key, JSON.stringify(defaultValue));
        return defaultValue;
      } catch (err) {
        console.error(`KV read error for key ${key}:`, err);
      }
    }
  }

  // 2. Supabase REST API (Free PostgreSQL)
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
      // Upsert default
      await setStoreData(env, key, defaultValue);
      return defaultValue;
    } catch (err) {
      console.error(`Supabase read error for ${key}:`, err);
    }
  }

  // 3. Firebase Firestore REST API (Free Google Cloud NoSQL)
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
      // Seed default
      await setStoreData(env, key, defaultValue);
      return defaultValue;
    } catch (err) {
      console.error(`Firebase read error for ${key}:`, err);
    }
  }

  // 4. Cloudflare D1 (if attached)
  if (provider === 'd1' && env.DB) {
    try {
      const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<{ value: string }>();
      if (row && row.value) {
        return JSON.parse(row.value);
      }
      await setStoreData(env, key, defaultValue);
      return defaultValue;
    } catch (err) {
      console.error(`D1 read error for ${key}:`, err);
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

  // 2. Supabase REST API
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

  // 3. Firebase Firestore REST API
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

  // 4. Cloudflare D1
  if (provider === 'd1' && env.DB) {
    try {
      const now = new Date().toISOString();
      const serialized = JSON.stringify(value);
      await env.DB.prepare(
        'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?'
      ).bind(key, serialized, now, serialized, now).run();
      memoryCache.set(key, value);
      return true;
    } catch (err) {
      console.error(`D1 write error for ${key}:`, err);
    }
  }

  // 5. Memory Cache
  memoryCache.set(key, value);
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

export async function saveCategory(env: Env, categoryData: { id?: string; name: string; description?: string }): Promise<Category> {
  const categories = await getCategories(env);
  const trimmedName = categoryData.name.trim();

  const existingIndex = categories.findIndex(c => c.id === categoryData.id || c.name.toLowerCase() === trimmedName.toLowerCase());
  let targetCategory: Category;

  if (existingIndex >= 0) {
    targetCategory = {
      ...categories[existingIndex],
      name: trimmedName,
      description: categoryData.description !== undefined ? categoryData.description : categories[existingIndex].description
    };
    categories[existingIndex] = targetCategory;
  } else {
    targetCategory = {
      id: categoryData.id || `cat_${Date.now()}`,
      name: trimmedName,
      description: categoryData.description || ''
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

export async function getSiteContentStore(env: Env): Promise<Record<string, string>> {
  return await getStoreData<Record<string, string>>(env, KEY_CONTENT, {});
}

export async function saveSiteContentStore(env: Env, content: Record<string, string>): Promise<Record<string, string>> {
  await setStoreData(env, KEY_CONTENT, content);
  return content;
}

export async function resetSiteContentStore(env: Env): Promise<boolean> {
  await deleteStoreData(env, KEY_CONTENT);
  return true;
}