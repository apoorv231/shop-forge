// Checkout API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const checkoutService = {
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

  applyPromoCode: async (code: string) => {
    const response = await fetch(`${API_BASE_URL}/checkout/promo`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code }),
    });
    return response.json();
  },

  calculateShipping: async (address: any) => {
    const response = await fetch(`${API_BASE_URL}/checkout/shipping`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(address),
    });
    return response.json();
  },
};
