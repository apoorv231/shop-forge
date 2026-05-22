// Seller Management API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const sellerService = {
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

  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/seller/dashboard`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/seller/orders`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};
