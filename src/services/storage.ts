// Production Edge Storage and API Service for IDEA HOME / Arasteh Industrial
// Hybrid Architecture:
// 1. Cloud Mode: Connects to Cloudflare Pages Functions + D1 (SQLite) + ImageKit Media Library (Signed Direct Uploads)
// 2. Local Preview Mode: Seamless fallback to persistent LocalStorage for dev server & preview sandbox
// Fully handles Persian digits (۰-۹), spaces in passwords, and custom passwords.

import { Product, CatalogInfo, PriceListInfo, ContactMessage, AdminUser, Category, SliderProduct, CompanyPhoto } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_CATALOG, INITIAL_PRICE_LIST, INITIAL_MESSAGES, INITIAL_COMPANY_PHOTOS } from '../data/initialData';
import { DEFAULT_SLIDER_PRODUCTS } from '../data/sliderProducts';
import { compressImage } from '../utils/imageCompressor';
import { 
  sanitizeSliderProducts, 
  sanitizeCategories, 
  sanitizeCompanyPhotos, 
  sanitizeProducts,
  purgeLegacyStorage 
} from '../utils/imageUtils';

// Purge any stale Unsplash mock data from browser storage on service load
purgeLegacyStorage();

const AUTH_TOKEN_KEY = 'arasteh_auth_token';
const ADMIN_USER_KEY = 'arasteh_admin_user';
const ADMIN_CREDS_KEY = 'arasteh_admin_credentials';
const LOCAL_PRODUCTS_KEY = 'arasteh_products_db';
const LOCAL_CATEGORIES_KEY = 'arasteh_categories_db';
const LOCAL_CATALOG_KEY = 'arasteh_catalog_db';
const LOCAL_CATALOG_BLOB_KEY = 'arasteh_catalog_pdf_blob';
const LOCAL_PRICE_LIST_KEY = 'arasteh_price_list_db';
const LOCAL_PRICE_LIST_BLOB_KEY = 'arasteh_price_list_pdf_blob';
const LOCAL_SLIDER_KEY = 'arasteh_slider_db';
const LOCAL_MESSAGES_KEY = 'arasteh_messages_db';

// --- ROBUST INDEXED-DB PERSISTENCE (Handles 100MB+ image datasets without quota limits) ---
const IDB_NAME = 'arasteh_ideahome_v2';
const IDB_STORE = 'arasteh_store';

function openIDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbSet(key: string, val: any): Promise<void> {
  try {
    const db = await openIDB();
    if (!db) return;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(val, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}
}

export async function idbGet<T = any>(key: string): Promise<T | null> {
  try {
    const db = await openIDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.warn(`localStorage quota safe fallback for ${key}; data preserved in IndexedDB.`, err);
    return false;
  }
}

export const toPersianDigits = (n: number | string): string => {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

export const normalizeInputString = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .trim();
};

export const formatPrice = (price: number): string => {
  const formatted = price.toLocaleString('en-US');
  return `${toPersianDigits(formatted)} تومان`;
};

class StorageService {
  private isCloudflareAvailable: boolean | null = null;

  // Verify backend availability and Cloudflare bindings
  async checkCloudflareBackend(): Promise<boolean> {
    if (this.isCloudflareAvailable !== null) return this.isCloudflareAvailable;
    try {
      const res = await fetch('/api/health', {
        headers: { Accept: 'application/json' },
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json().catch(() => null);
        this.isCloudflareAvailable = Boolean(data && (data.status === 'ok' || data.success === true));
      } else {
        this.isCloudflareAvailable = false;
      }
    } catch {
      this.isCloudflareAvailable = false;
    }
    return this.isCloudflareAvailable;
  }

  // --- AUTHENTICATION HELPERS ---
  getAuthToken(): string | null {
    let token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token && localStorage.getItem(ADMIN_USER_KEY)) {
      token = 'auth_token_session';
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    return token;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  // Silent automatic re-authentication in the background if session ever expires or desyncs
  private async silentReAuth(): Promise<boolean> {
    try {
      const savedCredsRaw = localStorage.getItem(ADMIN_CREDS_KEY);
      let username = 'admin';
      let password = 'admin123';
      if (savedCredsRaw) {
        try {
          const parsed = JSON.parse(savedCredsRaw);
          if (parsed.username) username = parsed.username;
          if (parsed.password) password = parsed.password;
        } catch {}
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          if (data.user) {
            localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
          }
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  }

  // Unified fetch wrapper with resilient Authorization header and automatic 401 recovery
  async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }
    if (!headers.has('Accept')) {
      headers.set('Accept', 'application/json');
    }

    const token = this.getAuthToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let response = await fetch(url, { ...options, headers });

    // If 401 (Invalid token / expired session), attempt silent background re-auth & retry once
    if (response.status === 401) {
      const refreshed = await this.silentReAuth();
      if (refreshed) {
        const freshToken = this.getAuthToken();
        if (freshToken) {
          headers.set('Authorization', `Bearer ${freshToken}`);
        }
        response = await fetch(url, { ...options, headers });
      }
    }

    return response;
  }

  getCurrentAdmin(): AdminUser | null {
    const local = localStorage.getItem(ADMIN_USER_KEY);
    if (!local) return null;
    try {
      const user = JSON.parse(local);
      const token = this.getAuthToken() || 'local_session_active';
      return { ...user, token };
    } catch {
      return null;
    }
  }

  // --- 1. PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const cleaned = sanitizeProducts(data);
          await idbSet(LOCAL_PRODUCTS_KEY, cleaned);
          safeLocalStorageSet(LOCAL_PRODUCTS_KEY, JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch {
      // Fallback to local
    }

    const fromIdb = await idbGet<Product[]>(LOCAL_PRODUCTS_KEY);
    if (Array.isArray(fromIdb) && fromIdb.length > 0) {
      const cleaned = sanitizeProducts(fromIdb);
      safeLocalStorageSet(LOCAL_PRODUCTS_KEY, JSON.stringify(cleaned));
      return cleaned;
    }

    const local = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = sanitizeProducts(parsed);
          await idbSet(LOCAL_PRODUCTS_KEY, cleaned);
          return cleaned;
        }
      } catch {}
    }

    const initialClean = sanitizeProducts(INITIAL_PRODUCTS);
    return initialClean;
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const res = await fetch(`/api/products/${id}`);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        return await res.json();
      }
    } catch {}
    const all = await this.getProducts();
    return all.find((p) => p.id === id) || null;
  }

  async saveProduct(product: Product): Promise<Product> {
    // 1. Direct Server API Call (Central Cloud Persistence - No silent localStorage fallback)
    const isNew = !product.id || product.id.startsWith('prod_');
    const endpoint = isNew ? '/api/products' : `/api/products/${product.id}`;
    const method = isNew ? 'POST' : 'PUT';

    const res = await this.fetchWithAuth(endpoint, {
      method,
      body: JSON.stringify(product)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'خطا در ارتباط با سرور' }));
      throw new Error(errData.error || errData.message || 'خطا در ذخیره اطلاعات محصول روی سرور مرکزی');
    }

    const saved: Product = await res.json();

    // 2. Synchronize verified server response to local client cache (for fast UI rendering)
    const all = await this.getProducts().catch(() => []);
    const existingIndex = all.findIndex((p) => p.id === saved.id);
    let updated: Product[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = saved;
    } else {
      updated = [saved, ...all];
    }
    await idbSet(LOCAL_PRODUCTS_KEY, updated);
    safeLocalStorageSet(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    return saved;
  }

  async deleteProduct(id: string): Promise<boolean> {
    // Direct Server API Call
    const res = await this.fetchWithAuth(`/api/products/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'خطا در حذف محصول از سرور' }));
      throw new Error(errData.error || errData.message || 'خطا در حذف محصول از سرور مرکزی ابری');
    }

    // Synchronize to cache
    const all = await this.getProducts().catch(() => []);
    const updated = all.filter((p) => p.id !== id);
    await idbSet(LOCAL_PRODUCTS_KEY, updated);
    safeLocalStorageSet(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    return true;
  }

  // --- 2. CATEGORIES (Server API Direct Persistence with Local & IDB Sync) ---
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch('/api/categories', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const cleaned = sanitizeCategories(data);
          await idbSet(LOCAL_CATEGORIES_KEY, cleaned);
          safeLocalStorageSet(LOCAL_CATEGORIES_KEY, JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch categories from server API:', e);
    }

    const fromIdb = await idbGet<Category[]>(LOCAL_CATEGORIES_KEY);
    if (Array.isArray(fromIdb) && fromIdb.length > 0) {
      const cleaned = sanitizeCategories(fromIdb);
      safeLocalStorageSet(LOCAL_CATEGORIES_KEY, JSON.stringify(cleaned));
      return cleaned;
    }

    const local = localStorage.getItem(LOCAL_CATEGORIES_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeCategories(parsed);
        }
      } catch {}
    }

    return sanitizeCategories(INITIAL_CATEGORIES);
  }

  async saveCategory(category: Partial<Category>): Promise<Category> {
    let saved: Category | null = null;
    try {
      const res = await this.fetchWithAuth('/api/categories', {
        method: 'POST',
        body: JSON.stringify(category)
      });
      if (res.ok) {
        saved = await res.json();
      }
    } catch (e) {
      console.warn('API saveCategory error, syncing to local storage:', e);
    }

    // Always update local cache & IDB reliably
    const all = await this.getCategories().catch(() => INITIAL_CATEGORIES);
    const catId = category.id || (saved ? saved.id : `cat_${Date.now()}`);
    const resolvedCat: Category = {
      id: catId,
      name: category.name || 'دسته‌بندی جدید',
      description: category.description || '',
      images: category.images || [],
      catalogUrl: category.catalogUrl || '',
      catalogTitle: category.catalogTitle || '',
      catalogSize: category.catalogSize || '',
      catalogUpdatedAt: category.catalogUpdatedAt || '',
      ...(saved || category)
    };

    const existingIndex = all.findIndex((c) => (resolvedCat.id && c.id === resolvedCat.id) || (resolvedCat.name && c.name === resolvedCat.name));
    let updated: Category[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = { ...updated[existingIndex], ...resolvedCat };
    } else {
      updated = [...all, resolvedCat];
    }

    await idbSet(LOCAL_CATEGORIES_KEY, updated);
    safeLocalStorageSet(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
    return resolvedCat;
  }

  async addCategory(name: string, description?: string): Promise<Category> {
    return this.saveCategory({ name, description });
  }

  async createCategory(name: string): Promise<Category> {
    return this.addCategory(name);
  }

  async updateCategory(category: Partial<Category>): Promise<Category> {
    return this.saveCategory(category);
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await this.fetchWithAuth(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('API deleteCategory error, syncing to local storage:', e);
    }

    // Synchronize to cache & IDB
    const all = await this.getCategories().catch(() => INITIAL_CATEGORIES);
    const updated = all.filter((c) => c.id !== id && c.name !== id);
    await idbSet(LOCAL_CATEGORIES_KEY, updated);
    safeLocalStorageSet(LOCAL_CATEGORIES_KEY, JSON.stringify(updated));
    return true;
  }

  // --- 2.1 FACTORY AND OFFICE PHOTOS (Server API Direct Persistence - No Browser Cache/Storage) ---
  async getCompanyPhotos(): Promise<CompanyPhoto[]> {
    try {
      const res = await fetch('/api/company-photos', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return sanitizeCompanyPhotos(data);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch company photos from server API:', e);
    }

    return INITIAL_COMPANY_PHOTOS;
  }

  async saveCompanyPhotos(photos: CompanyPhoto[]): Promise<CompanyPhoto[]> {
    const res = await this.fetchWithAuth('/api/company-photos', {
      method: 'POST',
      body: JSON.stringify(photos)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'خطا در ذخیره تصاویر روی سرور' }));
      throw new Error(errData.error || errData.message || 'خطا در ذخیره تصاویر روی سرور');
    }

    const data = await res.json().catch(() => null);
    return data?.items || photos;
  }

  async saveCompanyPhoto(photo: Partial<CompanyPhoto>): Promise<CompanyPhoto> {
    const res = await this.fetchWithAuth('/api/company-photos', {
      method: 'POST',
      body: JSON.stringify(photo)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'خطا در ذخیره تصویر روی سرور' }));
      throw new Error(errData.error || errData.message || 'خطا در ذخیره تصویر روی سرور');
    }

    return await res.json();
  }

  async deleteCompanyPhoto(id: string): Promise<boolean> {
    const res = await this.fetchWithAuth(`/api/company-photos?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'خطا در حذف تصویر از سرور' }));
      throw new Error(errData.error || errData.message || 'خطا در حذف تصویر از سرور');
    }

    return true;
  }

  // --- 3. CATALOG ---
  async getCatalogInfo(): Promise<CatalogInfo> {
    // 1. Try fast API fetch with 2-second timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/catalog', { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);
      if (res && res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json().catch(() => null);
          if (data && data.fileUrl) {
            await idbSet(LOCAL_CATALOG_KEY, data);
            safeLocalStorageSet(LOCAL_CATALOG_KEY, JSON.stringify(data));
            return data;
          }
        }
      }
    } catch {}

    // 2. Check IndexedDB (virtually unlimited quota, stores custom PDF blobs)
    const fromIdb = await idbGet<CatalogInfo>(LOCAL_CATALOG_KEY);
    if (fromIdb && fromIdb.fileUrl) {
      const storedBlob = await idbGet<Blob | File>(LOCAL_CATALOG_BLOB_KEY);
      if (storedBlob) {
        try {
          // If the URL was a previous blob URL or empty, create a fresh valid blob URL
          if (!fromIdb.fileUrl.startsWith('http')) {
            fromIdb.fileUrl = URL.createObjectURL(storedBlob);
          }
        } catch {}
      }
      return fromIdb;
    }

    // 3. Check LocalStorage fallback
    const local = localStorage.getItem(LOCAL_CATALOG_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const storedBlob = await idbGet<Blob | File>(LOCAL_CATALOG_BLOB_KEY);
        if (storedBlob && !parsed.fileUrl.startsWith('http')) {
          parsed.fileUrl = URL.createObjectURL(storedBlob);
        }
        return parsed;
      } catch {}
    }

    await idbSet(LOCAL_CATALOG_KEY, INITIAL_CATALOG);
    safeLocalStorageSet(LOCAL_CATALOG_KEY, JSON.stringify(INITIAL_CATALOG));
    return INITIAL_CATALOG;
  }

  async getCatalog(): Promise<CatalogInfo> {
    return this.getCatalogInfo();
  }

  async updateCatalogInfo(info: Partial<CatalogInfo>): Promise<CatalogInfo> {
    const payloadToSend = { ...info };
    if (payloadToSend.fileUrl && payloadToSend.fileUrl.startsWith('data:')) {
      payloadToSend.fileUrl = '/ideahome-catalog.pdf';
    }

    let saved: CatalogInfo = {
      ...(await this.getCatalogInfo().catch(() => INITIAL_CATALOG)),
      ...info,
      updatedAt: info.updatedAt || new Date().toLocaleDateString('fa-IR')
    };

    // Cache to IndexedDB and localStorage immediately so user edits are never lost
    await idbSet(LOCAL_CATALOG_KEY, saved);
    safeLocalStorageSet(LOCAL_CATALOG_KEY, JSON.stringify(saved));

    try {
      const res = await this.fetchWithAuth('/api/catalog', {
        method: 'PUT',
        body: JSON.stringify(payloadToSend)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'خطا در ثبت مشخصات کاتالوگ در سرور' }));
        console.warn('Server catalog update warning:', errData);
      } else {
        const serverData: CatalogInfo = await res.json().catch(() => null);
        if (serverData && serverData.fileUrl) {
          saved = serverData;
          await idbSet(LOCAL_CATALOG_KEY, saved);
          safeLocalStorageSet(LOCAL_CATALOG_KEY, JSON.stringify(saved));
        }
      }
    } catch (err) {
      console.warn('Network error updating catalog on server, retained locally:', err);
    }

    return saved;
  }

  async updateCatalog(info: Partial<CatalogInfo>): Promise<CatalogInfo> {
    return this.updateCatalogInfo(info);
  }

  // --- 3.1 PRICE LIST ---
  async getPriceListInfo(): Promise<PriceListInfo> {
    // 1. Try fast API fetch with 2-second timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/price-list', { signal: controller.signal }).catch(() => null);
      clearTimeout(timeoutId);
      if (res && res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json().catch(() => null);
          if (data && data.fileUrl) {
            await idbSet(LOCAL_PRICE_LIST_KEY, data);
            safeLocalStorageSet(LOCAL_PRICE_LIST_KEY, JSON.stringify(data));
            return data;
          }
        }
      }
    } catch {}

    // 2. Check IndexedDB
    const fromIdb = await idbGet<PriceListInfo>(LOCAL_PRICE_LIST_KEY);
    if (fromIdb && fromIdb.fileUrl) {
      const storedBlob = await idbGet<Blob | File>(LOCAL_PRICE_LIST_BLOB_KEY);
      if (storedBlob) {
        try {
          if (!fromIdb.fileUrl.startsWith('http')) {
            fromIdb.fileUrl = URL.createObjectURL(storedBlob);
          }
        } catch {}
      }
      return fromIdb;
    }

    // 3. Check LocalStorage fallback
    const local = localStorage.getItem(LOCAL_PRICE_LIST_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        const storedBlob = await idbGet<Blob | File>(LOCAL_PRICE_LIST_BLOB_KEY);
        if (storedBlob && !parsed.fileUrl.startsWith('http')) {
          parsed.fileUrl = URL.createObjectURL(storedBlob);
        }
        return parsed;
      } catch {}
    }

    await idbSet(LOCAL_PRICE_LIST_KEY, INITIAL_PRICE_LIST);
    safeLocalStorageSet(LOCAL_PRICE_LIST_KEY, JSON.stringify(INITIAL_PRICE_LIST));
    return INITIAL_PRICE_LIST;
  }

  async getPriceList(): Promise<PriceListInfo> {
    return this.getPriceListInfo();
  }

  async updatePriceListInfo(info: Partial<PriceListInfo>): Promise<PriceListInfo> {
    const payloadToSend = { ...info };
    if (payloadToSend.fileUrl && payloadToSend.fileUrl.startsWith('data:')) {
      payloadToSend.fileUrl = '/ideahome-pricelist.pdf';
    }

    let saved: PriceListInfo = {
      ...(await this.getPriceListInfo().catch(() => INITIAL_PRICE_LIST)),
      ...info,
      updatedAt: info.updatedAt || new Date().toLocaleDateString('fa-IR')
    };

    // Cache to IndexedDB and localStorage immediately
    await idbSet(LOCAL_PRICE_LIST_KEY, saved);
    safeLocalStorageSet(LOCAL_PRICE_LIST_KEY, JSON.stringify(saved));

    try {
      const res = await this.fetchWithAuth('/api/price-list', {
        method: 'PUT',
        body: JSON.stringify(payloadToSend)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'خطا در ثبت مشخصات لیست قیمت در سرور' }));
        console.warn('Server price-list update warning:', errData);
      } else {
        const serverData: PriceListInfo = await res.json().catch(() => null);
        if (serverData && serverData.fileUrl) {
          saved = serverData;
          await idbSet(LOCAL_PRICE_LIST_KEY, saved);
          safeLocalStorageSet(LOCAL_PRICE_LIST_KEY, JSON.stringify(saved));
        }
      }
    } catch (err) {
      console.warn('Network error updating price-list on server, retained locally:', err);
    }

    return saved;
  }

  async updatePriceList(info: Partial<PriceListInfo>): Promise<PriceListInfo> {
    return this.updatePriceListInfo(info);
  }

  // --- 4. SHOWCASE / SLIDER ---
  async getSliderProducts(): Promise<SliderProduct[]> {
    const sanitize = (list: SliderProduct[]) => {
      const mapped = list.map(item => ({
        id: item.id,
        image: item.image,
        imageKey: item.imageKey,
        active: item.active !== false,
        order: item.order,
        code: item.code || '',
        title: item.title || '',
        category: item.category || '',
        badge: item.badge || '',
        description: item.description || ''
      }));
      return sanitizeSliderProducts(mapped);
    };

    try {
      const res = await fetch('/api/slider?all=true', { cache: 'no-store' });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const cleaned = sanitize(data);
          if (cleaned.length > 0) {
            await idbSet(LOCAL_SLIDER_KEY, cleaned);
            safeLocalStorageSet(LOCAL_SLIDER_KEY, JSON.stringify(cleaned));
            return cleaned;
          }
        }
      }
    } catch {}

    // Check IndexedDB cache
    const fromIdb = await idbGet<SliderProduct[]>(LOCAL_SLIDER_KEY);
    if (Array.isArray(fromIdb)) {
      const cleaned = sanitize(fromIdb);
      if (cleaned.length > 0) {
        safeLocalStorageSet(LOCAL_SLIDER_KEY, JSON.stringify(cleaned));
        return cleaned;
      }
    }

    const local = localStorage.getItem(LOCAL_SLIDER_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          const cleaned = sanitize(parsed);
          if (cleaned.length > 0) {
            await idbSet(LOCAL_SLIDER_KEY, cleaned);
            return cleaned;
          }
        }
      } catch {}
    }

    await idbSet(LOCAL_SLIDER_KEY, DEFAULT_SLIDER_PRODUCTS);
    safeLocalStorageSet(LOCAL_SLIDER_KEY, JSON.stringify(DEFAULT_SLIDER_PRODUCTS));
    return DEFAULT_SLIDER_PRODUCTS;
  }

  async saveSliderProducts(items: SliderProduct[]): Promise<SliderProduct[]> {
    // 1. Immediately cache locally in IndexedDB & LocalStorage so UI never loses changes
    await idbSet(LOCAL_SLIDER_KEY, items);
    safeLocalStorageSet(LOCAL_SLIDER_KEY, JSON.stringify(items));

    let finalItems = items;

    // 2. Persist to central cloud database via server API
    try {
      const res = await this.fetchWithAuth('/api/slider', {
        method: 'POST',
        body: JSON.stringify(items)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'خطا در ذخیره اسلایدر روی سرور' }));
        console.warn('Server slider save warning:', errData);
      } else {
        const data = await res.json().catch(() => null);
        if (data?.items && Array.isArray(data.items)) {
          finalItems = data.items;
          await idbSet(LOCAL_SLIDER_KEY, finalItems);
          safeLocalStorageSet(LOCAL_SLIDER_KEY, JSON.stringify(finalItems));
        }
      }
    } catch (err) {
      console.warn('Network error saving slider to server, retained in local cache:', err);
    }

    return finalItems;
  }

  async resetSliderProducts(): Promise<SliderProduct[]> {
    return await this.saveSliderProducts(DEFAULT_SLIDER_PRODUCTS);
  }

  // --- 5. CONTACT & INQUIRIES ---
  async getMessages(): Promise<ContactMessage[]> {
    try {
      const res = await fetch('/api/contact', {
        headers: this.getAuthHeaders()
      });
  
      const contentType = res.headers.get('content-type') || '';
  
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
  
        if (Array.isArray(data)) {
          localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // Fall back to local storage if the API is unavailable.
    }
  
    const local = localStorage.getItem(LOCAL_MESSAGES_KEY);
  
    if (local) {
      try {
        const parsed = JSON.parse(local);
  
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // Ignore invalid local storage data.
      }
    }
  
    localStorage.setItem(
      LOCAL_MESSAGES_KEY,
      JSON.stringify(INITIAL_MESSAGES)
    );
  
    return INITIAL_MESSAGES;
  }
  
  async submitMessage(
    message: Omit<ContactMessage, 'id' | 'date' | 'status'>
  ): Promise<ContactMessage> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });
  
    const contentType = res.headers.get('content-type') || '';
  
    let data: any = null;
  
    if (contentType.includes('application/json')) {
      try {
        data = await res.json();
      } catch {
        data = null;
      }
    } else {
      try {
        const text = await res.text();
        data = text ? { message: text } : null;
      } catch {
        data = null;
      }
    }
  
    // Never report success when the API request failed.
    if (!res.ok) {
      throw new Error(
        data?.message ||
        data?.error ||
        `ارسال پیام ناموفق بود. کد خطا: ${res.status}`
      );
    }
  
    const newMessage: ContactMessage = {
      ...message,
      id: data?.id || `msg_${Date.now()}`,
      date: new Date().toLocaleDateString('fa-IR'),
      status: 'unread'
    };
  
    // Keep local storage synchronized without making the user-facing
    // submission depend on a second API request.
    const local = localStorage.getItem(LOCAL_MESSAGES_KEY);
  
    let all: ContactMessage[] = [];
  
    if (local) {
      try {
        const parsed = JSON.parse(local);
  
        if (Array.isArray(parsed)) {
          all = parsed;
        }
      } catch {
        all = [];
      }
    }
  
    const updated = [
      newMessage,
      ...all.filter((m) => m.id !== newMessage.id)
    ];
  
    localStorage.setItem(
      LOCAL_MESSAGES_KEY,
      JSON.stringify(updated)
    );
  
    return newMessage;
  }
  
  async markMessageAsRead(id: string): Promise<void> {
    const res = await this.fetchWithAuth(`/api/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'read' })
    });
  
    if (!res.ok) {
      throw new Error(`Failed to mark message as read (${res.status})`);
    }
  
    const all = await this.getMessages();
  
    const updated = all.map((m) =>
      m.id === id
        ? { ...m, status: 'read' as const }
        : m
    );
  
    localStorage.setItem(
      LOCAL_MESSAGES_KEY,
      JSON.stringify(updated)
    );
  }
  
  async deleteMessage(id: string): Promise<void> {
    const res = await this.fetchWithAuth(`/api/contact/${id}`, {
      method: 'DELETE'
    });
  
    if (!res.ok) {
      throw new Error(`Failed to delete message (${res.status})`);
    }
  
    const all = await this.getMessages();
  
    const updated = all.filter((m) => m.id !== id);
  
    localStorage.setItem(
      LOCAL_MESSAGES_KEY,
      JSON.stringify(updated)
    );
  }
  // --- 6. FILE UPLOADS (High-Speed Compressed Upload with ImageKit & Local Resilient Fallback) ---
  async uploadFile(
    file: File,
    folder: 'products' | 'catalog' | 'priceList' | 'slider' | 'uploads' = 'products',
    extra?: Record<string, string>
  ): Promise<{ success: boolean; url: string; key?: string; publicId?: string; fileId?: string; error?: string }> {
    let uploadTargetFile = file;
    let fallbackDataUrl = '';

    // Catalog or Price List PDF: upload through Cloudflare server -> ImageKit
    // This avoids direct browser access to upload.imagekit.io.
    if (folder === 'catalog' || folder === 'priceList' || file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      if (file.size > 25 * 1024 * 1024) {
        return {
          success: false,
          url: '',
          error: 'حجم فایل PDF بیشتر از حد مجاز 25 مگابایت است.'
        };
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', file.name || (folder === 'priceList' ? 'IdeaHome-PriceList.pdf' : 'IdeaHome-Catalog.pdf'));

        const uploadController = new AbortController();
        const uploadTimeout = setTimeout(() => uploadController.abort(), 300000);

        const uploadRes = await this.fetchWithAuth('/api/upload', {
          method: 'POST',
          body: formData,
          signal: uploadController.signal
        }).catch((error) => {
          console.error('CATALOG SERVER UPLOAD NETWORK ERROR:', error);
          return null;
        });

        clearTimeout(uploadTimeout);

        if (!uploadRes) {
          return {
            success: false,
            url: '',
            error: 'ارتباط با سرور آپلود برقرار نشد.'
          };
        }

        const responseText = await uploadRes.text();

        let data: any = null;
        try {
          data = JSON.parse(responseText);
        } catch {
          console.error('CATALOG SERVER INVALID JSON:', responseText);
          return {
            success: false,
            url: '',
            error: 'پاسخ سرور آپلود معتبر نیست.'
          };
        }

        if (!uploadRes.ok || !data?.success || !data?.url) {
          console.error('CATALOG SERVER UPLOAD ERROR:', uploadRes.status, data);

          return {
            success: false,
            url: '',
            error: data?.error || 'آپلود کاتالوگ در سرور ناموفق بود.'
          };
        }

        if (!/^https?:\/\//i.test(data.url)) {
          console.error('INVALID CATALOG URL:', data);

          return {
            success: false,
            url: '',
            error: 'سرور لینک دائمی کاتالوگ را برنگرداند.'
          };
        }

        console.log('CATALOG SERVER → IMAGEKIT SUCCESS:', data.url);

        return {
          success: true,
          url: data.url,
          key: data.fileId || data.key,
          publicId: data.fileId || data.publicId,
          fileId: data.fileId
        };
      } catch (error: any) {
        console.error('CATALOG SERVER UPLOAD EXCEPTION:', error);

        return {
          success: false,
          url: '',
          error: error?.name === 'AbortError'
            ? 'زمان آپلود کاتالوگ به پایان رسید. لطفاً دوباره تلاش کنید.'
            : 'خطا در آپلود کاتالوگ. لطفاً دوباره تلاش کنید.'
        };
      }
    }

    // 1. Client-Side Instant Compression for images
    if (file.type && file.type.startsWith('image/')) {
      try {
        const compressed = await compressImage(file, 1600, 1600, 0.82);
        uploadTargetFile = compressed.file;
        fallbackDataUrl = compressed.dataUrl;
      } catch (err) {
        console.warn('Image compression fallback:', err);
      }
    } else {
      // Non-image (e.g. general raw file) max 50MB check
      if (file.size > 50 * 1024 * 1024) {
        return {
          success: false,
          url: '',
          error: `حجم فایل (${(file.size / (1024 * 1024)).toFixed(1)}MB) بیش از سقف مجاز (حداکثر ۵۰ مگابایت) است.`
        };
      }
    }

    const oldKey = extra?.oldKey || extra?.oldPublicId;

    // 2. Try fast signed ImageKit upload
    try {
      const signController = new AbortController();
      const signTimeout = setTimeout(() => signController.abort(), 4000);

      const signRes = await this.fetchWithAuth('/api/upload/sign', {
        method: 'POST',
        body: JSON.stringify({ folder }),
        signal: signController.signal
      }).catch(() => null);

      clearTimeout(signTimeout);

      const contentType = signRes?.headers?.get('content-type') || '';
      if (signRes && signRes.ok && contentType.includes('application/json')) {
        const signData = await signRes.json().catch(() => null);

        if (signData?.signature && signData?.publicKey && signData?.token && signData?.expire) {
          const ikFormData = new FormData();
          ikFormData.append('file', uploadTargetFile);
          ikFormData.append('fileName', uploadTargetFile.name || `image_${Date.now()}.jpg`);
          ikFormData.append('publicKey', signData.publicKey);
          ikFormData.append('signature', signData.signature);
          ikFormData.append('expire', String(signData.expire));
          ikFormData.append('token', signData.token);
          if (signData.folder) {
            ikFormData.append('folder', signData.folder);
          }
          ikFormData.append('useUniqueFileName', 'true');

          const uploadUrl = 'https://upload.imagekit.io/api/v1/files/upload';
          const ikController = new AbortController();
          const ikTimeout = setTimeout(() => ikController.abort(), 12000);

          const ikRes = await fetch(uploadUrl, {
            method: 'POST',
            body: ikFormData,
            signal: ikController.signal
          }).catch(() => null);

          clearTimeout(ikTimeout);

          if (ikRes && ikRes.ok) {
            const ikData = await ikRes.json();
            const fileUrl = ikData.url;
            const fileId = ikData.fileId;

            if (oldKey && !oldKey.startsWith('local_') && !oldKey.startsWith('http')) {
              this.deleteUploadedFile(oldKey, 'image').catch(() => {});
            }

            return {
              success: true,
              url: fileUrl,
              key: fileId,
              publicId: fileId,
              fileId: fileId
            };
          }
        }
      }
    } catch {
      // Graceful fallback to optimized dataUrl
    }

    // 3. Instant local fallback with zero delay
    if (fallbackDataUrl) {
      const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      return {
        success: true,
        url: fallbackDataUrl,
        key: id,
        publicId: id
      };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        resolve({
          success: true,
          url: reader.result as string,
          key: id,
          publicId: id
        });
      };
      reader.onerror = () => {
        resolve({
          success: false,
          url: '',
          error: 'خطا در بارگذاری فایل در مرورگر'
        });
      };
      reader.readAsDataURL(uploadTargetFile);
    });
  }

  // Batch upload multiple files simultaneously with concurrency control & progress callback
  async uploadMultipleFiles(
    files: File[],
    folder: 'products' | 'catalog' | 'slider' | 'uploads' = 'slider',
    onProgress?: (completed: number, total: number) => void
  ): Promise<Array<{ success: boolean; url: string; key?: string; error?: string }>> {
    const results: Array<{ success: boolean; url: string; key?: string; error?: string }> = [];
    let completed = 0;
    const concurrency = 4;

    for (let i = 0; i < files.length; i += concurrency) {
      const chunk = files.slice(i, i + concurrency);
      const chunkResults = await Promise.all(
        chunk.map(async (file) => {
          const res = await this.uploadFile(file, folder);
          completed++;
          if (onProgress) onProgress(completed, files.length);
          return res;
        })
      );
      results.push(...chunkResults);
    }
    return results;
  }

  async deleteUploadedFile(keyOrFileId: string, resourceType: 'image' | 'raw' = 'image'): Promise<{ success: boolean; error?: string }> {
    if (!keyOrFileId || keyOrFileId.startsWith('local_') || keyOrFileId.startsWith('http')) {
      return { success: true };
    }

    try {
      await this.fetchWithAuth(`/api/upload?fileId=${encodeURIComponent(keyOrFileId)}&key=${encodeURIComponent(keyOrFileId)}&resource_type=${resourceType}`, {
        method: 'DELETE'
      });
    } catch {}
    return { success: true };
  }

  // --- 7. HYBRID AUTHENTICATION (Cloudflare Edge API + Resilient Local Auth) ---
  async login(username: string, pass: string): Promise<{ success: boolean; message?: string }> {
    const cleanUser = normalizeInputString(username).toLowerCase();
    const cleanPass = normalizeInputString(pass);

    if (!cleanUser || !cleanPass) {
      return { success: false, message: 'لطفاً نام کاربری و رمز عبور را وارد فرمایید.' };
    }

    // 1. Authenticate against central server endpoint
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username: cleanUser, password: cleanPass })
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json().catch(() => null);
        if (res.ok && data?.success && data?.token) {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
          return { success: true };
        } else if (!res.ok) {
          return {
            success: false,
            message: data?.error || data?.message || 'نام کاربری یا رمز عبور وارد شده نادرست است.'
          };
        }
      }
    } catch {
      // Network unreachable (offline)
    }

    // 2. Local Fallback Verification (Preview sandbox & Dev mode)
    const savedCredsRaw = localStorage.getItem(ADMIN_CREDS_KEY);
    let storedUser = 'admin';
    let storedPass = 'admin123';

    if (savedCredsRaw) {
      try {
        const parsed = JSON.parse(savedCredsRaw);
        if (parsed.username) storedUser = parsed.username;
        if (parsed.password) storedPass = parsed.password;
      } catch {}
    }

    const targetUser = normalizeInputString(storedUser).toLowerCase();
    const targetPass = normalizeInputString(storedPass);

    const isUserMatch = cleanUser === targetUser;

    // Support exact match, whitespace-free match, and common variations (admin 123 vs admin123)
    const cleanPassNoSpace = cleanPass.replace(/\s+/g, '');
    const targetPassNoSpace = targetPass.replace(/\s+/g, '');

    const isPassMatch =
      cleanPass === targetPass ||
      cleanPassNoSpace === targetPassNoSpace ||
      (targetPassNoSpace === 'admin123' && (cleanPassNoSpace === 'admin123' || cleanPass === 'admin 123'));

    if (isUserMatch && isPassMatch) {
      const token = `auth_token_${Date.now()}`;
      const user: AdminUser = {
        username: storedUser,
        name: 'مدیر ارشد آیدیا هوم (IDEA HOME)',
        role: 'super_admin',
        token
      };
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
      return { success: true };
    }

    return {
      success: false,
      message: 'نام کاربری یا رمز عبور وارد شده نادرست است.'
    };
  }

  async changePassword(oldPass: string, newPass: string): Promise<{ success: boolean; message?: string }> {
    const cleanOld = normalizeInputString(oldPass);
    const cleanNew = normalizeInputString(newPass);

    // Try cloud API
    try {
      const res = await fetch('/api/auth/password', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ oldPassword: cleanOld, newPassword: cleanNew })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json().catch(() => null);
        if (data?.success) {
          this.updateLocalPassword(cleanNew);
          return { success: true, message: data.message || 'رمز عبور با موفقیت به‌روزرسانی شد.' };
        }
      }
    } catch {}

    // Verify old local pass
    const savedCredsRaw = localStorage.getItem(ADMIN_CREDS_KEY);
    let storedPass = 'admin123';
    if (savedCredsRaw) {
      try {
        const parsed = JSON.parse(savedCredsRaw);
        if (parsed.password) storedPass = parsed.password;
      } catch {}
    }

    const cleanOldNoSpace = cleanOld.replace(/\s+/g, '');
    const storedPassNoSpace = storedPass.replace(/\s+/g, '');

    if (cleanOld !== storedPass && cleanOldNoSpace !== storedPassNoSpace) {
      return { success: false, message: 'رمز عبور فعلی وارد شده نادرست است.' };
    }

    this.updateLocalPassword(cleanNew);
    return { success: true, message: 'رمز عبور با موفقیت به‌روزرسانی شد.' };
  }

  private updateLocalPassword(newPass: string) {
    const savedCredsRaw = localStorage.getItem(ADMIN_CREDS_KEY);
    let creds = { username: 'admin', password: 'admin123' };
    if (savedCredsRaw) {
      try {
        creds = { ...creds, ...JSON.parse(savedCredsRaw) };
      } catch {}
    }
    creds.password = normalizeInputString(newPass);
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));
  }

  async updateAdminCredentials(username: string, password?: string): Promise<AdminUser> {
    const cleanUser = normalizeInputString(username);
    const cleanPass = password ? normalizeInputString(password) : undefined;

    // Try cloud update
    try {
      await fetch('/api/auth/password', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          newUsername: cleanUser,
          ...(cleanPass ? { newPassword: cleanPass } : {})
        })
      });
    } catch {}

    // Update local credentials
    const savedCredsRaw = localStorage.getItem(ADMIN_CREDS_KEY);
    let creds = { username: 'admin', password: 'admin123' };
    if (savedCredsRaw) {
      try {
        creds = { ...creds, ...JSON.parse(savedCredsRaw) };
      } catch {}
    }
    creds.username = cleanUser;
    if (cleanPass) creds.password = cleanPass;
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(creds));

    const token = this.getAuthToken() || `auth_token_${Date.now()}`;
    const updatedUser: AdminUser = {
      username: cleanUser,
      name: 'مدیر ارشد آیدیا هوم (IDEA HOME)',
      role: 'super_admin',
      token
    };

    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  }

  async resetToDefaults(): Promise<void> {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(INITIAL_CATEGORIES));
    localStorage.setItem(LOCAL_CATALOG_KEY, JSON.stringify(INITIAL_CATALOG));
    localStorage.setItem(LOCAL_PRICE_LIST_KEY, JSON.stringify(INITIAL_PRICE_LIST));
    localStorage.setItem(LOCAL_SLIDER_KEY, JSON.stringify(DEFAULT_SLIDER_PRODUCTS));
    localStorage.setItem(LOCAL_MESSAGES_KEY, JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ username: 'admin', password: 'admin123' }));
  }
}

export const storageService = new StorageService();
