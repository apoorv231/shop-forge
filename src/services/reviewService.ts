// Review API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const reviewService = {
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

  getMyReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews/my`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};
