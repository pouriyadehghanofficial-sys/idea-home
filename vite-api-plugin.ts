// Development API middleware for Vite dev server (AI Studio preview & local development)
// In production on Cloudflare Pages, Cloudflare's functions/api/* takes over automatically

import type { Plugin, ViteDevServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_CATALOG, INITIAL_MESSAGES } from './src/data/initialData';
import { DEFAULT_SLIDER_PRODUCTS } from './src/data/sliderProducts';

export function viteApiPlugin(): Plugin {
  // In-memory dev storage state initialized with official factory data
  let products = [...INITIAL_PRODUCTS];
  let categories = [...INITIAL_CATEGORIES];
  let catalog = { ...INITIAL_CATALOG };
  let slider = [...DEFAULT_SLIDER_PRODUCTS];
  let messages = [...INITIAL_MESSAGES];

  return {
    name: 'vite-api-middleware',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api')) {
          return next();
        }

        const method = req.method || 'GET';
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        // Helper to parse JSON body
        const parseBody = (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        const cleanUrl = url.split('?')[0];

        // 1. Health
        if (cleanUrl === '/api/health') {
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              status: 'ok',
              success: true,
              storage: {
                provider: 'dev_server',
                providerName: 'Vite Local Dev API (Production uses Cloudflare KV)',
                isCentralCloud: true
              }
            })
          );
        }

        // 2. Auth Login
        if (cleanUrl === '/api/auth/login' && method === 'POST') {
          const body = await parseBody();
          const username = (body.username || '').trim().toLowerCase();
          const password = (body.password || '').trim();

          const expectedUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
          const expectedPass = process.env.ADMIN_PASSWORD || 'admin123';

          if ((username === expectedUser && password === expectedPass) || (username === 'admin' && password === 'admin123')) {
            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                success: true,
                token: `dev_jwt_token_${Date.now()}`,
                user: {
                  id: 'admin_dev',
                  username,
                  name: 'مدیر ارشد آیدیا هوم',
                  role: 'super_admin'
                }
              })
            );
          } else {
            res.statusCode = 401;
            return res.end(
              JSON.stringify({
                success: false,
                message: 'نام کاربری یا رمز عبور اشتباه است.'
              })
            );
          }
        }

        // 2.1 Auth Current User Profile
        if (cleanUrl === '/api/auth/me') {
          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              authenticated: true,
              user: {
                username: process.env.ADMIN_USERNAME || 'admin',
                name: 'مدیر ارشد آیدیا هوم',
                role: 'super_admin'
              }
            })
          );
        }

        // 2.2 Upload Signature / Auth & Fallback
        if ((cleanUrl === '/api/upload/sign' || cleanUrl === '/api/upload/auth') && method === 'POST') {
          const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
          const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
          const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

          if (!publicKey || !privateKey) {
            res.statusCode = 200;
            return res.end(
              JSON.stringify({
                success: false,
                fallback: true,
                code: 'IMAGEKIT_SECRETS_MISSING',
                message: 'Local dev mode: ImageKit credentials not configured, fallback to high-speed local compressed storage'
              })
            );
          }

          const body = await parseBody();
          const folder = `/ideahome/${body.folder || 'products'}`;
          const crypto = await import('crypto');
          const token = (body.token && typeof body.token === 'string') ? body.token : crypto.randomUUID();
          const expire = Math.floor(Date.now() / 1000) + 1800;
          const signature = crypto.createHmac('sha1', privateKey).update(token + expire).digest('hex');

          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              success: true,
              token,
              expire,
              signature,
              publicKey,
              urlEndpoint: urlEndpoint || '',
              folder
            })
          );
        }

        // 2.3 Upload Delete / Destroy
        if ((cleanUrl === '/api/upload' || cleanUrl === '/api/upload/destroy') && (method === 'DELETE' || method === 'POST')) {
          const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
          if (privateKey) {
            try {
              const urlObj = new URL(req.url || '', 'http://localhost');
              let fileId = urlObj.searchParams.get('fileId') || urlObj.searchParams.get('file_id') || urlObj.searchParams.get('key') || urlObj.searchParams.get('public_id');
              if (!fileId && method === 'POST') {
                const b = await parseBody();
                fileId = b.fileId || b.file_id || b.key || b.public_id;
              }
              if (fileId && !fileId.startsWith('local_') && !fileId.startsWith('http')) {
                const authHeader = 'Basic ' + Buffer.from(`${privateKey}:`).toString('base64');
                await fetch(`https://api.imagekit.io/v1/files/${encodeURIComponent(fileId)}`, {
                  method: 'DELETE',
                  headers: { Authorization: authHeader }
                }).catch(() => null);
              }
            } catch {}
          }
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        }

        // 3. Products
        if (cleanUrl === '/api/products') {
          if (method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(products));
          }
          if (method === 'POST') {
            const body = await parseBody();
            if (!body.name || !body.category || body.price === undefined) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'نام، دسته‌بندی و قیمت الزامی است.' }));
            }
            const now = new Date().toISOString().split('T')[0];
            const existingIdx = body.id ? products.findIndex((p) => p.id === body.id) : -1;
            if (existingIdx >= 0) {
              products[existingIdx] = { ...products[existingIdx], ...body, updatedAt: now };
              res.statusCode = 200;
              return res.end(JSON.stringify(products[existingIdx]));
            } else {
              const newProd = {
                ...body,
                id: body.id || `prod_${Date.now()}`,
                createdAt: now,
                updatedAt: now
              };
              products.unshift(newProd);
              res.statusCode = 201;
              return res.end(JSON.stringify(newProd));
            }
          }
        }

        // Products /:id
        if (cleanUrl.startsWith('/api/products/')) {
          const id = cleanUrl.replace('/api/products/', '');
          if (method === 'GET') {
            const found = products.find((p) => p.id === id);
            if (!found) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'محصول یافت نشد.' }));
            }
            res.statusCode = 200;
            return res.end(JSON.stringify(found));
          }
          if (method === 'PUT') {
            const body = await parseBody();
            const idx = products.findIndex((p) => p.id === id);
            if (idx === -1) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'محصول یافت نشد.' }));
            }
            products[idx] = { ...products[idx], ...body, id, updatedAt: new Date().toISOString().split('T')[0] };
            res.statusCode = 200;
            return res.end(JSON.stringify(products[idx]));
          }
          if (method === 'DELETE') {
            products = products.filter((p) => p.id !== id);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, deletedId: id }));
          }
        }

        // 4. Categories
        if (cleanUrl === '/api/categories') {
          if (method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(categories));
          }
          if (method === 'POST') {
            const body = await parseBody();
            const name = (body.name || '').trim();
            if (!name) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'نام دسته‌بندی الزامی است.' }));
            }
            const existing = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
            if (existing) {
              res.statusCode = 200;
              return res.end(JSON.stringify(existing));
            }
            const newCat = { id: `cat_${Date.now()}`, name, description: body.description || '' };
            categories.push(newCat);
            res.statusCode = 201;
            return res.end(JSON.stringify(newCat));
          }
          if (method === 'DELETE') {
            const urlObj = new URL(req.url || '', 'http://localhost');
            const catId = urlObj.searchParams.get('id') || urlObj.searchParams.get('name');
            categories = categories.filter((c) => c.id !== catId && c.name !== catId);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true }));
          }
        }

        if (cleanUrl.startsWith('/api/categories/')) {
          const catId = cleanUrl.replace('/api/categories/', '');
          if (method === 'DELETE') {
            categories = categories.filter((c) => c.id !== catId && c.name !== catId);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, deletedId: catId }));
          }
        }

        // 5. Catalog
        if (cleanUrl === '/api/catalog') {
          if (method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(catalog));
          }
          if (method === 'PUT') {
            const body = await parseBody();
            catalog = { ...catalog, ...body, updatedAt: new Date().toLocaleDateString('fa-IR') };
            res.statusCode = 200;
            return res.end(JSON.stringify(catalog));
          }
        }

        // 5.1 Catalog Download Proxy
        if (cleanUrl === '/api/catalog/download') {
          const urlObj = new URL(req.url || '', 'http://localhost');
          const fileUrl = urlObj.searchParams.get('url');
          if (!fileUrl) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'پارامتر url الزامی است.' }));
          }
          try {
            const upstream = await fetch(fileUrl);
            if (upstream.ok) {
              const buffer = await upstream.arrayBuffer();
              const contentType = upstream.headers.get('content-type') || 'application/pdf';
              res.setHeader('Content-Type', contentType);
              res.setHeader('Content-Disposition', 'attachment; filename="catalog.pdf"');
              res.statusCode = 200;
              return res.end(Buffer.from(buffer));
            }
          } catch {}
          res.writeHead(302, { Location: fileUrl });
          return res.end();
        }

        // 6. Slider
        if (cleanUrl === '/api/slider') {
          if (method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(slider));
          }
          if (method === 'POST') {
            const body = await parseBody();
            if (Array.isArray(body)) {
              slider = body;
            } else {
              const idx = slider.findIndex((s) => String(s.id) === String(body.id));
              if (idx >= 0) slider[idx] = { ...slider[idx], ...body };
              else slider.push(body);
            }
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, items: slider }));
          }
        }

        // 7. Contact
        if (cleanUrl === '/api/contact') {
          if (method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(messages));
          }
          if (method === 'POST') {
            const body = await parseBody();
            const newMsg = {
              ...body,
              id: `msg_${Date.now()}`,
              date: new Date().toLocaleDateString('fa-IR'),
              status: 'unread'
            };
            messages.unshift(newMsg);
            res.statusCode = 201;
            return res.end(JSON.stringify({ success: true, id: newMsg.id }));
          }
        }

        return next();
      });
    }
  };
}