// Content Repository for IDEA HOME (آیدیا هوم)
//
// Server-Side Persistence Authority:
//
// Admin
//   ↓
// API
//   ↓
// Persistent Cloud Storage (ImageKit/KV)
//   ↓
// GET /api/content
//   ↓
// All Browsers
//
// IMPORTANT:
// This repository must NEVER allow a broken/hanging API request
// to keep the application waiting indefinitely.

import {
  DEFAULT_SITE_CONTENT,
  getContentDefinition,
} from '../data/defaultContent';

import { idbSet } from './storage';

const LOCAL_CONTENT_KEY =
  'arasteh_site_content_db';

/*
 * Maximum amount of time a GET /api/content request is allowed
 * to remain pending.
 *
 * This protects the application from a hanging Cloudflare/API
 * request and prevents the browser tab from remaining in a
 * permanent loading state because of content loading.
 */
const CONTENT_REQUEST_TIMEOUT_MS = 5000;

export class ContentRepository {
  private inMemoryCache:
    | Record<string, string>
    | null = null;

  /**
   * Synchronous initial content.
   *
   * This method must remain synchronous because it can be used
   * during the initial React render.
   */
  getInitialContentSync(): Record<string, string> {
    if (this.inMemoryCache) {
      return this.inMemoryCache;
    }

    return {
      ...DEFAULT_SITE_CONTENT,
    };
  }

  /**
   * GET /api/content
   *
   * Behavior:
   *
   * 1. Ask the server for the latest content.
   * 2. Do not use browser/edge cache.
   * 3. Abort the request after CONTENT_REQUEST_TIMEOUT_MS.
   * 4. If successful, merge with DEFAULT_SITE_CONTENT.
   * 5. Save successful data to local persistence.
   * 6. If server fails, use local persistence.
   * 7. If everything fails, use in-memory/default content.
   */
  async getSiteContent(): Promise<
    Record<string, string>
  > {
    let controller:
      | AbortController
      | null = null;

    let timeoutId:
      | ReturnType<typeof setTimeout>
      | null = null;

    try {
      controller =
        new AbortController();

      timeoutId = setTimeout(() => {
        controller?.abort();
      }, CONTENT_REQUEST_TIMEOUT_MS);

      /*
       * IMPORTANT:
       *
       * No timestamp query parameter is used here.
       *
       * ContentContext handles the visual loading strategy.
       *
       * cache: 'no-store' ensures that the browser does not
       * intentionally serve a cached GET response.
       */
      const res = await fetch(
        '/api/content',
        {
          method: 'GET',

          cache: 'no-store',

          signal:
            controller.signal,

          headers: {
            Accept:
              'application/json',

            'Cache-Control':
              'no-store, no-cache, must-revalidate',

            Pragma:
              'no-cache',
          },
        }
      );

      if (res.ok) {
        const remoteData =
          await res.json();

        if (
          remoteData &&
          typeof remoteData === 'object' &&
          !Array.isArray(remoteData)
        ) {
          /*
           * DEFAULT_SITE_CONTENT provides the complete
           * application shape while server values override
           * defaults.
           */
          const merged = {
            ...DEFAULT_SITE_CONTENT,
            ...remoteData,
          };

          /*
           * Keep the newest successful server response
           * in memory.
           */
          this.inMemoryCache =
            merged;

          /*
           * Persist the successful response locally.
           *
           * These operations must never block the main
           * content-loading path if local storage fails.
           */
          try {
            localStorage.setItem(
              LOCAL_CONTENT_KEY,
              JSON.stringify(
                merged
              )
            );

            /*
             * IndexedDB is secondary persistence.
             *
             * It is intentionally not required for the
             * initial rendering path.
             */
            await idbSet(
              LOCAL_CONTENT_KEY,
              merged
            );
          } catch {
            /*
             * Local persistence failure must never turn a
             * successful server response into an application
             * failure.
             */
          }

          return merged;
        }

        console.warn(
          'GET /api/content returned an invalid content object.'
        );
      } else {
        console.warn(
          `GET /api/content failed with HTTP ${res.status}.`
        );
      }
    } catch (err) {
      /*
       * AbortController timeout.
       *
       * This is expected protection against a hanging API.
       */
      if (
        err instanceof DOMException &&
        err.name === 'AbortError'
      ) {
        console.warn(
          `GET /api/content timed out after ${CONTENT_REQUEST_TIMEOUT_MS}ms.`
        );
      } else {
        console.warn(
          'Server fetch failed:',
          err
        );
      }
    } finally {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    }

    /*
     * ---------------------------------------------------------
     * LOCAL FALLBACK
     * ---------------------------------------------------------
     *
     * If the server is unavailable, use the last locally
     * persisted content.
     */
    try {
      const local =
        localStorage.getItem(
          LOCAL_CONTENT_KEY
        );

      if (local) {
        const parsed =
          JSON.parse(local);

        if (
          parsed &&
          typeof parsed === 'object' &&
          !Array.isArray(parsed)
        ) {
          const merged = {
            ...DEFAULT_SITE_CONTENT,
            ...parsed,
          };

          this.inMemoryCache =
            merged;

          return merged;
        }
      }
    } catch {
      /*
       * Ignore malformed/unavailable local storage.
       */
    }

    /*
     * ---------------------------------------------------------
     * IN-MEMORY / DEFAULT FALLBACK
     * ---------------------------------------------------------
     */
    return (
      this.inMemoryCache || {
        ...DEFAULT_SITE_CONTENT,
      }
    );
  }

  /**
   * Save the complete site content.
   *
   * The server remains the persistence authority.
   *
   * The local cache is updated only after the server confirms
   * that the save succeeded.
   */
  async saveSiteContent(
    newContent: Record<string, string>
  ): Promise<boolean> {
    const token =
      localStorage.getItem(
        'arasteh_auth_token'
      ) ||
      'local_session_active';

    /*
     * Get the latest available content first.
     *
     * This protects against accidentally replacing the complete
     * persisted object with an incomplete client object.
     *
     * NOTE:
     * getSiteContent has a 5-second timeout, so a broken API
     * cannot leave this operation hanging forever.
     */
    const current =
      await this.getSiteContent();

    /*
     * Apply the requested changes on top of the
     * latest available content.
     */
    const mergedContent = {
      ...current,
      ...newContent,
    };

    const res = await fetch(
      '/api/content',
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'application/json',

          'Cache-Control':
            'no-store',

          Authorization:
            `Bearer ${token}`,
        },

        body: JSON.stringify(
          mergedContent
        ),
      }
    );

    if (!res.ok) {
      const err =
        await res
          .json()
          .catch(
            () => ({})
          );

      throw new Error(
        err.error ||
          err.message ||
          'خطا در ذخیره محتوا'
      );
    }

    const data =
      await res
        .json()
        .catch(
          () => ({})
        );

    if (
      data.success === false
    ) {
      throw new Error(
        data.error ||
          'ذخیره محتوا تایید نشد'
      );
    }

    /*
     * The server accepted the changes.
     *
     * Only now update local persistence.
     */
    this.inMemoryCache =
      mergedContent;

    try {
      localStorage.setItem(
        LOCAL_CONTENT_KEY,
        JSON.stringify(
          mergedContent
        )
      );

      await idbSet(
        LOCAL_CONTENT_KEY,
        mergedContent
      );
    } catch {
      /*
       * Local cache failure does not mean the server save failed.
       */
    }

    return true;
  }

  /**
   * حذف یک کلید مشخص
   */
  async deleteContentKey(
    key: string
  ): Promise<boolean> {
    const current =
      await this.getSiteContent();

    delete current[key];

    await this.saveSiteContent(
      current
    );

    return true;
  }

  /**
   * Reset a single field to its factory default.
   */
  async resetField(
    id: string
  ): Promise<string> {
    const def =
      getContentDefinition(id);

    const value =
      def
        ? def.defaultValue
        : '';

    const current =
      await this.getSiteContent();

    current[id] =
      value;

    await this.saveSiteContent(
      current
    );

    return value;
  }

  /**
   * Reset all fields belonging to a section.
   */
  async resetSection(
    sectionKey: string
  ): Promise<
    Record<string, string>
  > {
    const current =
      await this.getSiteContent();

    const {
      CONTENT_DEFINITIONS,
    } = await import(
      '../data/defaultContent'
    );

    CONTENT_DEFINITIONS
      .filter(
        (item) =>
          item.sectionKey ===
          sectionKey
      )
      .forEach(
        (item) => {
          current[item.id] =
            item.defaultValue;
        }
      );

    await this.saveSiteContent(
      current
    );

    return current;
  }

  /**
   * Reset all persisted content through the server.
   */
  async resetAll(): Promise<
    Record<string, string>
  > {
    const token =
      localStorage.getItem(
        'arasteh_auth_token'
      ) ||
      'local_session_active';

    const res =
      await fetch(
        '/api/content',
        {
          method: 'DELETE',

          headers: {
            'Cache-Control':
              'no-store',

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    if (!res.ok) {
      const err =
        await res
          .json()
          .catch(
            () => ({})
          );

      throw new Error(
        err.error ||
          err.message ||
          'خطا در بازنشانی محتوا'
      );
    }

    /*
     * Reset in-memory state.
     */
    this.inMemoryCache = {
      ...DEFAULT_SITE_CONTENT,
    };

    /*
     * Reset local persistence.
     */
    try {
      localStorage.removeItem(
        LOCAL_CONTENT_KEY
      );

      await idbSet(
        LOCAL_CONTENT_KEY,
        DEFAULT_SITE_CONTENT
      );
    } catch {
      /*
       * Ignore local persistence errors.
       */
    }

    return {
      ...DEFAULT_SITE_CONTENT,
    };
  }
}

export const contentRepository =
  new ContentRepository();
