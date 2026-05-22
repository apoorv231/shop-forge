// API Service for Products, Orders, Cart, etc.
// Ready for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const apiService = {
  // Products
  products: {
    getAll: async (filters?: any) => {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/products?${query}`);
      return response.json();
    },
    
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      return response.json();
    },
    
    create: async (productData: any) => {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      return response.json();
    },
    
    update: async (id: string, productData: any) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      return response.json();
    },
    
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },

  // Orders
  orders: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    
    create: async (orderData: any) => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });
      return response.json();
    },
    
    updateStatus: async (id: string, status: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      return response.json();
    },

    cancel: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    // Seller orders
    getSellerOrders: async () => {
      const response = await fetch(`${API_BASE_URL}/seller/orders`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },

  // Cart
  cart: {
    get: async () => {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    
    addItem: async (productId: string, quantity: number, size?: string) => {
      const response = await fetch(`${API_BASE_URL}/cart/items`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity, size }),
      });
      return response.json();
    },
    
    updateItem: async (itemId: string, quantity: number) => {
      const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      });
      return response.json();
    },
    
    removeItem: async (itemId: string) => {
      const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    
    clear: async () => {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },

  // Profile
  profile: {
    get: async () => {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    update: async (profileData: any) => {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      return response.json();
    },

    updatePassword: async (oldPassword: string, newPassword: string) => {
      const response = await fetch(`${API_BASE_URL}/profile/password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      return response.json();
    },

    uploadAvatar: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });
      return response.json();
    },
  },

  // Users (Admin)
  users: {
    getAll: async (filters?: any) => {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE_URL}/users?${query}`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    getById: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    
    updateRole: async (userId: string, role: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      });
      return response.json();
    },

    delete: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    block: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/block`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    unblock: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/unblock`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },

  // Permissions (Admin)
  permissions: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/permissions`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    getRolePermissions: async (role: string) => {
      const response = await fetch(`${API_BASE_URL}/permissions/role/${role}`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    updateRolePermissions: async (role: string, permissions: string[]) => {
      const response = await fetch(`${API_BASE_URL}/permissions/role/${role}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ permissions }),
      });
      return response.json();
    },
  },

  // Seller Management
  seller: {
    // Onboarding
    submitOnboarding: async (data: any) => {
      const response = await fetch(`${API_BASE_URL}/seller/onboarding`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return response.json();
    },

    getOnboardingStatus: async () => {
      const response = await fetch(`${API_BASE_URL}/seller/onboarding/status`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    // Products
    getProducts: async () => {
      const response = await fetch(`${API_BASE_URL}/seller/products`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    // Analytics
    getAnalytics: async () => {
      const response = await fetch(`${API_BASE_URL}/seller/analytics`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },

  // Wishlist
  wishlist: {
    get: async () => {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },

    add: async (productId: string) => {
      const response = await fetch(`${API_BASE_URL}/wishlist`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId }),
      });
      return response.json();
    },

    remove: async (productId: string) => {
      const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },

  // Reviews
  reviews: {
    getByProduct: async (productId: string) => {
      const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
      return response.json();
    },

    create: async (productId: string, rating: number, comment: string) => {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, rating, comment }),
      });
      return response.json();
    },

    update: async (reviewId: string, rating: number, comment: string) => {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating, comment }),
      });
      return response.json();
    },

    delete: async (reviewId: string) => {
      const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },

  // Checkout
  checkout: {
    createOrder: async (orderData: any) => {
      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });
      return response.json();
    },

    verifyPayment: async (paymentId: string) => {
      const response = await fetch(`${API_BASE_URL}/checkout/verify`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ paymentId }),
      });
      return response.json();
    },
  },
};
