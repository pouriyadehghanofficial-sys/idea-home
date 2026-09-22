// Development API middleware for Vite dev server (AI Studio preview & local development)
// In production on Cloudflare Pages, Cloudflare's functions/api/* takes over automatically

import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_CATALOG, INITIAL_PRICE_LIST, INITIAL_MESSAGES, INITIAL_COMPANY_PHOTOS } from './src/data/initialData';
import { DEFAULT_SLIDER_PRODUCTS } from './src/data/sliderProducts';
import { DEFAULT_SITE_CONTENT } from './src/data/defaultContent';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site_content.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {}

export function viteApiPlugin(): Plugin {
  // Persistent dev storage state
  let products = [...INITIAL_PRODUCTS];
  let categories = [...INITIAL_CATEGORIES];
  let catalog = { ...INITIAL_CATALOG };
  let priceList = { ...INITIAL_PRICE_LIST };
  let slider = [...DEFAULT_SLIDER_PRODUCTS];
  let messages = [...INITIAL_MESSAGES];
  let companyPhotos = [...INITIAL_COMPANY_PHOTOS];
  let siteContent: Record<string, string> = { ...DEFAULT_SITE_CONTENT };

  // Load persistent file from disk if available
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        siteContent = parsed;
      }
    }
  } catch {}

  const imagekitPrivateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const imagekitUrlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  // Helper to fetch content JSON from ImageKit
  async function fetchFromImageKit(): Promise<Record<string, string> | null> {
    if (!imagekitUrlEndpoint) return null;
    try {
      const url = `${imagekitUrlEndpoint.replace(/\/$/, '')}/ideahome/data/ideahome_site_content.json?t=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          return data as Record<string, string>;
        }
      }
    } catch (err) {
      console.warn('[vite-api-plugin] ImageKit fetch warning:', err);
    }
    return null;
  }

  // Helper to persist content JSON to ImageKit
  async function uploadToImageKit(content: Record<string, string>): Promise<boolean> {
    if (!imagekitPrivateKey) return true;
    try {
      const jsonStr = JSON.stringify(content, null, 2);
      const base64Data = Buffer.from(jsonStr, 'utf-8').toString('base64');

      const form = new FormData();
      form.append('file', base64Data);
      form.append('fileName', 'ideahome_site_content.json');
      form.append('folder', '/ideahome/data');
      form.append('useUniqueFileName', 'false');
      form.append('overwriteFile', 'true');

      const authHeader = 'Basic ' + Buffer.from(`${imagekitPrivateKey}:`).toString('base64');
      const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: { Authorization: authHeader },
        body: form,
      });

      if (res.ok) {
        return true;
      } else {
        const errText = await res.text().catch(() => '');
        console.error('[vite-api-plugin] ImageKit upload error:', res.status, errText);
        return false;
      }
    } catch (err) {
      console.error('[vite-api-plugin] ImageKit upload exception:', err);
      return false;
    }
  }

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
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('Access-Control-Max-Age', '86400');

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

        // 2.25 Server File Upload (Multipart Form Data)
        if (cleanUrl === '/api/upload' && method === 'POST' && req.headers['content-type']?.includes('multipart/form-data')) {
          try {
            const request = new Request('http://localhost:3000' + (req.url || '/api/upload'), {
              method: 'POST',
              headers: req.headers as any,
              body: req as any,
              duplex: 'half'
            } as any);

            const incoming = await request.formData();
            const file = incoming.get('file');

            if (!file || !(file instanceof Blob)) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: false, error: 'فایل ارسال نشده است.' }));
            }

            const rawFileName = (incoming.get('fileName') as string) || (file as any).name || 'IdeaHome-Document.pdf';
            const isPrice = rawFileName.toLowerCase().includes('price');
            const isCatalog = rawFileName.toLowerCase().includes('catalog');
            const requestedFolder = incoming.get('folder') as string;
            const folder = requestedFolder || (isPrice ? '/ideahome/price-list' : isCatalog ? '/ideahome/catalog' : '/ideahome/uploads');

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Data = buffer.toString('base64');
            const mimeType = file.type || 'application/pdf';

            const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
            if (privateKey) {
              const uploadForm = new FormData();
              uploadForm.append('file', base64Data);
              uploadForm.append('fileName', rawFileName);
              uploadForm.append('folder', folder);
              uploadForm.append('useUniqueFileName', 'true');

              const authHeader = 'Basic ' + Buffer.from(`${privateKey}:`).toString('base64');
              const ikRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                headers: {
                  Authorization: authHeader
                },
                body: uploadForm
              });

              const responseText = await ikRes.text();
              let ikData: any = {};
              try {
                ikData = JSON.parse(responseText);
              } catch {
                ikData = { raw: responseText };
              }

              if (ikRes.ok && ikData?.url) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({
                  success: true,
                  url: ikData.url,
                  fileId: ikData.fileId || '',
                  publicId: ikData.fileId || '',
                  key: ikData.fileId || '',
                  name: ikData.name || rawFileName,
                  size: ikData.size || file.size
                }));
              } else {
                console.error('IMAGEKIT UPLOAD ERROR IN DEV SERVER:', ikRes.status, ikData);
              }
            }

            // High-speed local dev fallback if ImageKit credentials missing or offline
            const dataUri = `data:${mimeType};base64,${base64Data}`;
            const localId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              success: true,
              url: dataUri,
              fileId: localId,
              publicId: localId,
              key: localId,
              name: rawFileName,
              size: file.size
            }));
          } catch (err: any) {
            console.error('VITE API UPLOAD HANDLER ERROR:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              success: false,
              error: err?.message || 'خطا در آپلود فایل در سرور'
            }));
          }
        }

        // 2.3 Upload Delete / Destroy
        if ((cleanUrl === '/api/upload/destroy' || (cleanUrl === '/api/upload' && method === 'DELETE')) || (cleanUrl === '/api/upload' && method === 'POST' && !req.headers['content-type']?.includes('multipart/form-data'))) {
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
          if (method === 'POST' || method === 'PUT') {
            const body = await parseBody();
            const name = (body.name || '').trim();
            if (!name && !body.id) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'نام دسته‌بندی الزامی است.' }));
            }
            const existingIndex = categories.findIndex((c) => (body.id && c.id === body.id) || (name && c.name.toLowerCase() === name.toLowerCase()));
            if (existingIndex >= 0) {
              const updated = {
                ...categories[existingIndex],
                ...body,
                name: name || categories[existingIndex].name,
              };
              categories[existingIndex] = updated;
              res.statusCode = 200;
              return res.end(JSON.stringify(updated));
            }
            const newCat = { 
              id: body.id || `cat_${Date.now()}`, 
              name, 
              description: body.description || '',
              images: body.images || [],
              catalogUrl: body.catalogUrl || '',
              catalogTitle: body.catalogTitle || '',
              catalogSize: body.catalogSize || '',
              catalogUpdatedAt: body.catalogUpdatedAt || ''
            };
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
          if (method === 'PUT' || method === 'POST') {
            const body = await parseBody();
            const existingIndex = categories.findIndex((c) => c.id === catId);
            if (existingIndex >= 0) {
              categories[existingIndex] = { ...categories[existingIndex], ...body, id: catId };
              res.statusCode = 200;
              return res.end(JSON.stringify(categories[existingIndex]));
            } else {
              const newCat = { id: catId, ...body };
              categories.push(newCat);
              res.statusCode = 201;
              return res.end(JSON.stringify(newCat));
            }
          }
          if (method === 'DELETE') {
            categories = categories.filter((c) => c.id !== catId && c.name !== catId);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, deletedId: catId }));
          }
        }

        // 4.1 Company Photos (Factory & Office Photos)
        if (cleanUrl === '/api/company-photos' || cleanUrl === '/api/gallery') {
          if (method === 'GET') {
            res.statusCode = 200;
            const sorted = [...companyPhotos].sort((a, b) => (a.order || 0) - (b.order || 0));
            return res.end(JSON.stringify(sorted));
          }
          if (method === 'POST') {
            const body = await parseBody();
            if (Array.isArray(body)) {
              companyPhotos = body;
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, items: companyPhotos }));
            }
            if (body && typeof body === 'object') {
              if (body.id) {
                const existingIdx = companyPhotos.findIndex((p) => p.id === body.id);
                if (existingIdx >= 0) {
                  companyPhotos[existingIdx] = { ...companyPhotos[existingIdx], ...body };
                  res.statusCode = 200;
                  return res.end(JSON.stringify(companyPhotos[existingIdx]));
                }
              }
              const newPhoto = {
                id: body.id || `photo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                url: body.url || '',
                title: body.title || 'تصویر جدید',
                category: body.category || 'factory',
                description: body.description || '',
                order: body.order !== undefined ? body.order : companyPhotos.length + 1,
                createdAt: body.createdAt || new Date().toLocaleDateString('fa-IR'),
                ...body
              };
              companyPhotos.push(newPhoto);
              res.statusCode = 201;
              return res.end(JSON.stringify(newPhoto));
            }
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'اطلاعات نامعتبر است.' }));
          }
          if (method === 'DELETE') {
            const urlObj = new URL(req.url || '', 'http://localhost');
            const id = urlObj.searchParams.get('id');
            if (id) {
              companyPhotos = companyPhotos.filter((p) => p.id !== id);
              res.statusCode = 200;
              return res.end(JSON.stringify({ success: true, deletedId: id }));
            }
          }
        }

        if (cleanUrl.startsWith('/api/company-photos/') || cleanUrl.startsWith('/api/gallery/')) {
          const id = cleanUrl.replace('/api/company-photos/', '').replace('/api/gallery/', '');
          if (method === 'DELETE') {
            companyPhotos = companyPhotos.filter((p) => p.id !== id);
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true, deletedId: id }));
          }
          if (method === 'PUT' || method === 'POST') {
            const body = await parseBody();
            const existingIdx = companyPhotos.findIndex((p) => p.id === id);
            if (existingIdx >= 0) {
              companyPhotos[existingIdx] = { ...companyPhotos[existingIdx], ...body, id };
              res.statusCode = 200;
              return res.end(JSON.stringify(companyPhotos[existingIdx]));
            }
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
              let guessedName = 'IdeaHome-Catalog.pdf';
              try {
                guessedName = decodeURIComponent(new URL(fileUrl).pathname.split('/').pop() || 'IdeaHome-Catalog.pdf');
              } catch {}
              res.setHeader('Content-Type', contentType);
              res.setHeader('Content-Disposition', `attachment; filename="${guessedName}"`);
              res.statusCode = 200;
              return res.end(Buffer.from(buffer));
            }
          } catch {}
          res.writeHead(302, { Location: fileUrl });
          return res.end();
        }

        // 5.2 Price List
        if (cleanUrl === '/api/price-list') {
          if (method === 'GET') {
            res.statusCode = 200;
            return res.end(JSON.stringify(priceList));
          }
          if (method === 'PUT') {
            const body = await parseBody();
            priceList = { ...priceList, ...body, updatedAt: new Date().toLocaleDateString('fa-IR') };
            res.statusCode = 200;
            return res.end(JSON.stringify(priceList));
          }
        }

        // 5.3 Price List Download Proxy
        if (cleanUrl === '/api/price-list/download') {
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
              let guessedName = 'IdeaHome-PriceList.pdf';
              try {
                guessedName = decodeURIComponent(new URL(fileUrl).pathname.split('/').pop() || 'IdeaHome-PriceList.pdf');
              } catch {}
              res.setHeader('Content-Type', contentType);
              res.setHeader('Content-Disposition', `attachment; filename="${guessedName}"`);
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

        // 6.1 Website Content 
        if (cleanUrl === '/api/content') {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');

          if (method === 'GET') {

            const cloudContent = await fetchFromImageKit();

            if (cloudContent) {
              siteContent = cloudContent;
            }

            res.statusCode = 200;
            return res.end(JSON.stringify(siteContent));
          }


          if (method === 'POST') {

            const body = await parseBody();

            if (!body || typeof body !== 'object') {
              res.statusCode = 400;
              return res.end(JSON.stringify({
                success:false,
                error:'اطلاعات نامعتبر است'
              }));
            }


            // Merge instead of replacing everything
            siteContent = {
              ...siteContent,
              ...body
            };


            // Local fallback for development
            try {
              fs.writeFileSync(
                CONTENT_FILE,
                JSON.stringify(siteContent, null, 2),
                'utf-8'
              );
            } catch {}


            // Save cloud copy
            if (imagekitPrivateKey) {

              const cloudSuccess = await uploadToImageKit(siteContent);

              if (!cloudSuccess) {
                res.statusCode = 500;

                return res.end(JSON.stringify({
                  success:false,
                  error:'ذخیره ImageKit ناموفق بود'
                }));
              }
            }


            res.statusCode = 200;

            return res.end(JSON.stringify({
              success:true,
              count:Object.keys(siteContent).length
            }));
          }



          if (method === 'DELETE') {

            siteContent = {};

            try {
              fs.writeFileSync(
                CONTENT_FILE,
                JSON.stringify({}, null, 2),
                'utf-8'
              );
            } catch {}


            if (imagekitPrivateKey) {
              await uploadToImageKit({});
            }


            res.statusCode = 200;

            return res.end(JSON.stringify({
              success:true
            }));
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
