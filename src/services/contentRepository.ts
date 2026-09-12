// Content Repository for IDEA HOME (آیدیا هوم)
// Provides reliable persistence via LocalStorage + IndexedDB with optional Cloudflare KV API sync

import { DEFAULT_SITE_CONTENT, getContentDefinition } from '../data/defaultContent';
import { idbGet, idbSet } from './storage';

const LOCAL_CONTENT_KEY = 'arasteh_site_content_db';

export class ContentRepository {
  private inMemoryCache: Record<string, string> | null = null;

  /**
   * Retrieves current website content, merging with defaults to guarantee no missing keys.
   */
  async getSiteContent(): Promise<Record<string, string>> {
    if (this.inMemoryCache) {
      return { ...DEFAULT_SITE_CONTENT, ...this.inMemoryCache };
    }

    let loadedContent: Record<string, string> | null = null;

    // 1. Try LocalStorage
    try {
      const stored = localStorage.getItem(LOCAL_CONTENT_KEY);
      if (stored) {
        loadedContent = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage read error for site content:', e);
    }

    // 2. Try IndexedDB fallback if local storage was empty
    if (!loadedContent) {
      try {
        const idbData = await idbGet<Record<string, string>>(LOCAL_CONTENT_KEY);
        if (idbData) {
          loadedContent = idbData;
        }
      } catch (e) {
        console.warn('IndexedDB read error for site content:', e);
      }
    }

    // 3. Try Remote API (Cloudflare KV) in background or if available
    try {
      const res = await fetch('/api/content', { credentials: 'omit' });
      if (res.ok) {
        const remoteData = await res.json();
        if (remoteData && typeof remoteData === 'object' && Object.keys(remoteData).length > 0) {
          loadedContent = { ...loadedContent, ...remoteData };
        }
      }
    } catch {
      // Offline / dev preview mode - perfectly normal
    }

    const merged = { ...DEFAULT_SITE_CONTENT, ...(loadedContent || {}) };
    this.inMemoryCache = merged;
    return merged;
  }

  /**
   * Persists updated website content locally and optionally to backend.
   */
  async saveSiteContent(newContent: Record<string, string>): Promise<boolean> {
    const merged = { ...DEFAULT_SITE_CONTENT, ...newContent };
    this.inMemoryCache = merged;

    // 1. LocalStorage
    try {
      localStorage.setItem(LOCAL_CONTENT_KEY, JSON.stringify(merged));
    } catch (e) {
      console.warn('Failed to save content to LocalStorage:', e);
    }

    // 2. IndexedDB backup
    try {
      await idbSet(LOCAL_CONTENT_KEY, merged);
    } catch {}

    // 3. Optional Backend KV sync
    try {
      const token = localStorage.getItem('arasteh_auth_token');
      await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(merged),
      });
    } catch {
      // Handled gracefully in offline / dev mode
    }

    return true;
  }

  /**
   * Resets a single content item back to default value.
   */
  async resetField(id: string): Promise<string> {
    const def = getContentDefinition(id);
    const defaultValue = def ? def.defaultValue : '';
    const current = await this.getSiteContent();
    current[id] = defaultValue;
    await this.saveSiteContent(current);
    return defaultValue;
  }

  /**
   * Resets all content fields for a specific section.
   */
  async resetSection(sectionKey: string): Promise<Record<string, string>> {
    const current = await this.getSiteContent();
    const { CONTENT_DEFINITIONS } = await import('../data/defaultContent');
    CONTENT_DEFINITIONS.filter((item) => item.sectionKey === sectionKey).forEach((item) => {
      current[item.id] = item.defaultValue;
    });
    await this.saveSiteContent(current);
    return current;
  }

  /**
   * Resets the entire website content back to initial factory defaults.
   */
  async resetAll(): Promise<Record<string, string>> {
    this.inMemoryCache = { ...DEFAULT_SITE_CONTENT };
    try {
      localStorage.removeItem(LOCAL_CONTENT_KEY);
    } catch {}
    try {
      await idbSet(LOCAL_CONTENT_KEY, DEFAULT_SITE_CONTENT);
    } catch {}

    try {
      const token = localStorage.getItem('arasteh_auth_token');
      await fetch('/api/content', {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
    } catch {}

    return { ...DEFAULT_SITE_CONTENT };
  }
}

export const contentRepository = new ContentRepository();
