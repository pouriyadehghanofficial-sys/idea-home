// Content Repository for IDEA HOME (آیدیا هوم)
// Strict Server-Side Persistence Authority:
// Admin → API → Persistent Cloud Storage (ImageKit/KV) → GET /api/content → All Browsers

import { DEFAULT_SITE_CONTENT, getContentDefinition } from '../data/defaultContent';
import { idbSet } from './storage';

export const CONTENT_CACHE_KEY = 'ideahome_content_cache';
const LEGACY_CACHE_KEY = 'arasteh_site_content_db';

export class ContentRepository {
  private inMemoryCache: Record<string, string> | null = null;

  hasCacheSync(): boolean {
    if (this.inMemoryCache && Object.keys(this.inMemoryCache).length > 0) {
      return true;
    }
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(CONTENT_CACHE_KEY) || localStorage.getItem(LEGACY_CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            return true;
          }
        }
      } catch {}
    }
    return false;
  }

  getInitialContentSync(): Record<string, string> {
    if (this.inMemoryCache) {
      return this.inMemoryCache;
    }

    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(CONTENT_CACHE_KEY) || localStorage.getItem(LEGACY_CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            const merged = {
              ...DEFAULT_SITE_CONTENT,
              ...parsed,
            };
            this.inMemoryCache = merged;
            return merged;
          }
        }
      } catch {}
    }

    return { ...DEFAULT_SITE_CONTENT };
  }

  async getSiteContent(): Promise<Record<string, string>> {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 4500) : null;

    try {
      const res = await fetch(`/api/content?t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
        },
        signal: controller ? controller.signal : undefined,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (res.ok) {
        const remoteData = await res.json();
        if (remoteData && typeof remoteData === 'object') {
          const merged = {
            ...DEFAULT_SITE_CONTENT,
            ...remoteData,
          };

          this.inMemoryCache = merged;

          try {
            localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(merged));
            localStorage.setItem(LEGACY_CACHE_KEY, JSON.stringify(merged));
            // Non-blocking IndexedDB sync
            idbSet(CONTENT_CACHE_KEY, merged).catch(() => {});
            idbSet(LEGACY_CACHE_KEY, merged).catch(() => {});
          } catch {}

          return merged;
        }
      }
    } catch (err: any) {
      if (timeoutId) clearTimeout(timeoutId);
      if (err?.name !== 'AbortError') {
        console.warn('Server content fetch failed:', err);
      }
    }

    try {
      const local = localStorage.getItem(CONTENT_CACHE_KEY) || localStorage.getItem(LEGACY_CACHE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === 'object') {
          const merged = {
            ...DEFAULT_SITE_CONTENT,
            ...parsed,
          };
          this.inMemoryCache = merged;
          return merged;
        }
      }
    } catch {}

    return this.inMemoryCache || { ...DEFAULT_SITE_CONTENT };
  }

  async saveSiteContent(newContent: Record<string, string>): Promise<boolean> {
    const token = localStorage.getItem('arasteh_auth_token') || 'local_session_active';

    const current = this.inMemoryCache || this.getInitialContentSync();
    const mergedContent = {
      ...current,
      ...newContent,
    };

    const res = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(mergedContent),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || err.message || 'خطا در ذخیره محتوا');
    }

    const data = await res.json().catch(() => ({}));
    if (data.success === false) {
      throw new Error(data.error || 'ذخیره محتوا تایید نشد');
    }

    this.inMemoryCache = mergedContent;

    try {
      localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(mergedContent));
      localStorage.setItem(LEGACY_CACHE_KEY, JSON.stringify(mergedContent));
      // Non-blocking IndexedDB sync
      idbSet(CONTENT_CACHE_KEY, mergedContent).catch(() => {});
      idbSet(LEGACY_CACHE_KEY, mergedContent).catch(() => {});
    } catch {}

    return true;
  }

  async deleteContentKey(key: string): Promise<boolean> {
    const current = { ...(this.inMemoryCache || this.getInitialContentSync()) };
    delete current[key];
    await this.saveSiteContent(current);
    return true;
  }

  async resetField(id: string): Promise<string> {
    const current = { ...(this.inMemoryCache || this.getInitialContentSync()) };
    const def = getContentDefinition(id);
    const value = def ? def.defaultValue : '';
    current[id] = value;
    await this.saveSiteContent(current);
    return value;
  }

  async resetSection(sectionKey: string): Promise<Record<string, string>> {
    const current = { ...(this.inMemoryCache || this.getInitialContentSync()) };
    const { CONTENT_DEFINITIONS } = await import('../data/defaultContent');
    CONTENT_DEFINITIONS
      .filter((item) => item.sectionKey === sectionKey)
      .forEach((item) => {
        current[item.id] = item.defaultValue;
      });

    await this.saveSiteContent(current);
    return current;
  }

  async resetAll(): Promise<Record<string, string>> {
    const token = localStorage.getItem('arasteh_auth_token') || 'local_session_active';

    const res = await fetch('/api/content', {
      method: 'DELETE',
      headers: {
        'Cache-Control': 'no-store',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('خطا در بازنشانی محتوا');
    }

    this.inMemoryCache = {
      ...DEFAULT_SITE_CONTENT,
    };

    try {
      localStorage.removeItem(CONTENT_CACHE_KEY);
      localStorage.removeItem(LEGACY_CACHE_KEY);
      idbSet(CONTENT_CACHE_KEY, DEFAULT_SITE_CONTENT).catch(() => {});
      idbSet(LEGACY_CACHE_KEY, DEFAULT_SITE_CONTENT).catch(() => {});
    } catch {}

    return {
      ...DEFAULT_SITE_CONTENT,
    };
  }
}

export const contentRepository = new ContentRepository();
