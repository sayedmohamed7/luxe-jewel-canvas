export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';

const getAuthToken = () => localStorage.getItem('jwt_token');
const getCurrentLanguage = () => localStorage.getItem('language') || 'en';

export const setAuthToken = (token: string) => localStorage.setItem('jwt_token', token);
export const removeAuthToken = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('user');
};

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const language = getCurrentLanguage();
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Language': language === 'ar' ? 'ar-AE' : 'en-US',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    // Check if it's a login/register endpoint
    if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      removeAuthToken();
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message || response.statusText);
  }

  // Handle empty response for 204
  if (response.status === 204) return null;

  return response.json();
}

export const api = {
  get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => fetchWithAuth(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint: string, body: any) => fetchWithAuth(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }),
  // multipart for file upload
  postForm: async (endpoint: string, formData: FormData) => {
    const token = getAuthToken();
    const language = getCurrentLanguage();
    const headers: any = {
      'Accept-Language': language === 'ar' ? 'ar-AE' : 'en-US'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    // Content-Type is auto-set by browser for FormData

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    return response.json();
  }
};

// Auth-specific interfaces for type safety
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  succeeded: boolean;
  token: string;
  errors?: string[];
}

// Auth endpoints with proper typing
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api.post('/auth/login', credentials);
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    return api.post('/auth/register', credentials);
  },

  // OAuth endpoints - redirects to backend
  googleLoginUrl: `${API_BASE_URL}/auth/google-login`,
  microsoftLoginUrl: `${API_BASE_URL}/auth/microsoft-login`,
};

// Helper to extract error messages from API response
export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};
