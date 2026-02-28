/**
 * API client for AURA backend. When VITE_API_URL is set, use server; otherwise app uses localStorage.
 */
import type { Product, Order, User, BlogPost } from './types';

const BASE = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL
  ? (import.meta as any).env.VITE_API_URL.replace(/\/$/, '')
  : '';

const ADMIN_TOKEN_KEY = 'aura_admin_token';

function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token: string | null) {
  if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
  else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: RequestInit & { admin?: boolean } = {}
): Promise<T> {
  const { admin, ...init } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((init.headers as Record<string, string>) || {}),
  };
  if (admin) {
    const t = getAdminToken();
    if (t) headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data as T;
}

export const api = {
  isConfigured: () => !!BASE,

  // Products
  getProducts: (): Promise<Product[]> =>
    request<Product[]>('/api/products'),

  setProducts: (products: Product[]): Promise<Product[]> =>
    request<Product[]>('/api/products', { method: 'PUT', body: JSON.stringify(products), admin: true }),

  patchProduct: (id: string, patch: Partial<Product>): Promise<Product> =>
    request<Product>(`/api/products/${id}`, { method: 'PATCH', body: JSON.stringify(patch), admin: true }),

  // Orders
  getOrders: (admin: boolean, email?: string): Promise<Order[]> => {
    const q = email ? `?email=${encodeURIComponent(email)}` : '';
    return request<Order[]>(`/api/orders${q}`, admin ? { admin: true } : {});
  },

  createOrder: (order: Order): Promise<Order> =>
    request<Order>('/api/orders', { method: 'POST', body: JSON.stringify(order) }),

  setOrders: (orders: Order[]): Promise<Order[]> =>
    request<Order[]>('/api/orders', { method: 'PUT', body: JSON.stringify(orders), admin: true }),

  // Users (admin only to list)
  getUsers: (): Promise<User[]> =>
    request<User[]>('/api/users', { admin: true }),

  // Auth
  register: (name: string, email: string, password: string): Promise<{ user: User }> =>
    request<{ user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string): Promise<{ user: User }> =>
    request<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  adminLogin: (email: string, password: string): Promise<{ token: string }> =>
    request<{ token: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).then((r) => {
      setAdminToken(r.token);
      return r;
    }),

  adminLogout: () => {
    setAdminToken(null);
  },

  // Blog
  getBlogPosts: (): Promise<BlogPost[]> =>
    request<BlogPost[]>('/api/blog'),

  setBlogPosts: (posts: BlogPost[]): Promise<BlogPost[]> =>
    request<BlogPost[]>('/api/blog', { method: 'PUT', body: JSON.stringify(posts), admin: true }),
};
