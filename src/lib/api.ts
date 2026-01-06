export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5240/api';

const getAuthToken = () => localStorage.getItem('auth_token');
const getCurrentLanguage = () => localStorage.getItem('language') || 'en';

export const setAuthToken = (token: string) => localStorage.setItem('auth_token', token);
export const removeAuthToken = () => localStorage.removeItem('auth_token');

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
    // Check if it's a login endpoint
    if (!endpoint.includes('/auth/login')) {
      removeAuthToken();
      window.location.href = '/login'; // Or handle better
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
