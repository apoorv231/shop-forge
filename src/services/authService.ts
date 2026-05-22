// API Service for Authentication
// Currently using demo logins, but ready for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: 'BUYER' | 'SELLER';
}

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
  message?: string;
}

export const authService = {
  // Login API call (ready for integration)
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login API error:', error);
      throw new Error('Login failed. Please try again.');
    }
  },

  // Signup API call (ready for integration)
  async signup(signupData: SignupData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Signup API error:', error);
      throw new Error('Signup failed. Please try again.');
    }
  },

  // Logout API call
  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout API error:', error);
      localStorage.removeItem('auth_token');
    }
  },

  // Verify token
  async verifyToken(): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return { success: false, message: 'No token found' };
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      return { success: false, message: 'Token verification failed' };
    }
  },

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};
