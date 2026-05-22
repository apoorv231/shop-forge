// Permission Management API Service (Admin)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const permissionService = {
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

  createPermission: async (permission: string, description: string) => {
    const response = await fetch(`${API_BASE_URL}/permissions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ permission, description }),
    });
    return response.json();
  },

  deletePermission: async (permission: string) => {
    const response = await fetch(`${API_BASE_URL}/permissions/${permission}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};
