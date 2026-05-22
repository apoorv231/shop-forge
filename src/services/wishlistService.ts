// Wishlist API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const wishlistService = {
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

  clear: async () => {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  isInWishlist: async (productId: string) => {
    const response = await fetch(`${API_BASE_URL}/wishlist/check/${productId}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};
