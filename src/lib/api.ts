// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Auth APIs
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (data: { email: string; password: string; name: string; role: string }) =>
    fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
};

// Product APIs
export const productAPI = {
  getAll: (filters?: any) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/products?${params}`);
  },

  getById: (id: string) => fetchAPI(`/products/${id}`),

  create: (data: any) =>
    fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/products/${id}`, {
      method: 'DELETE',
    }),
};

// User APIs
export const userAPI = {
  getAll: () => fetchAPI('/users'),

  getById: (id: string) => fetchAPI(`/users/${id}`),

  update: (id: string, data: any) =>
    fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Seller APIs
export const sellerAPI = {
  onboard: (data: any) =>
    fetchAPI('/seller/onboard', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProducts: () => fetchAPI('/seller/products'),
};

// Cart APIs
export const cartAPI = {
  get: () => fetchAPI('/cart'),

  addItem: (productId: string, quantity: number) =>
    fetchAPI('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  removeItem: (itemId: string) =>
    fetchAPI(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),

  updateQuantity: (itemId: string, quantity: number) =>
    fetchAPI(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),
};

// Order APIs
export const orderAPI = {
  // Buyer orders
  getMyOrders: () => fetchAPI('/orders/my'),
  
  createOrder: (data: any) =>
    fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Seller orders
  getSellerOrders: () => fetchAPI('/seller/orders'),

  updateOrderStatus: (orderId: string, status: string) =>
    fetchAPI(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Permission APIs
export const permissionAPI = {
  getRoles: () => fetchAPI('/permissions/roles'),

  createRole: (data: { name: string; permissions: string[] }) =>
    fetchAPI('/permissions/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateRole: (roleId: string, data: any) =>
    fetchAPI(`/permissions/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteRole: (roleId: string) =>
    fetchAPI(`/permissions/roles/${roleId}`, {
      method: 'DELETE',
    }),
};
