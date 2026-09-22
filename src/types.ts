export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: 'IRT';
  shortDescription: string;
  fullDescription: string;
  images: string[];
  specs: Record<string, string>;
  inStock: boolean;
  isFeatured?: boolean;
  code?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  iconName?: string;
  slug?: string;
  images?: string[];
  catalogUrl?: string;
  catalogTitle?: string;
  catalogSize?: string;
  catalogUpdatedAt?: string;
}

export interface CompanyPhoto {
  id: string;
  url: string;
  title: string;
  category: 'factory' | 'office';
  description?: string;
  order?: number;
  imageKey?: string;
  createdAt?: string;
}

export interface SliderProduct {
  id: number;
  image: string;
  code?: string;
  title?: string;
  category?: string;
  badge?: string;
  description?: string;
  active?: boolean;
  imageKey?: string;
  order?: number;
}

export interface CatalogInfo {
  id: string;
  title: string;
  version: string;
  updatedAt: string;
  fileUrl: string;
  fileSize: string;
  pageCount: number;
  description: string;
}

export interface PriceListInfo {
  id: string;
  title: string;
  version: string;
  updatedAt: string;
  fileUrl: string;
  fileSize: string;
  pageCount?: number;
  description: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read';
}

export interface AdminUser {
  username: string;
  name: string;
  role: 'super_admin' | 'editor';
  token?: string;
}

export interface CloudflareConfigStatus {
  kvNamespaceConfigured: boolean;
  imagekitConfigured: boolean;
  cloudinaryConfigured?: boolean;
  mode: 'cloudflare' | 'local_demo';
}