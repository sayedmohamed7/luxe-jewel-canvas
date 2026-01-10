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

// Product types matching backend
export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductPrice {
  currencyCode: string;
  amount: number;
}

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category: string;
  categoryAr?: string;
  status: string;
  isCurated: boolean;
  images: ProductImage[];
  prices: ProductPrice[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product?: Product;
}

// Products API
export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    return api.get("/products");
  },

  getById: async (id: string): Promise<Product> => {
    return api.get(`/products/${id}`);
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    return api.get(`/products/category/${category}`);
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    return api.get("/categories");
  },
};

// Cart API (for authenticated users)
export const cartApi = {
  get: async (): Promise<CartItem[]> => {
    return api.get("/cart");
  },

  addItem: async (productId: string, quantity: number = 1): Promise<CartItem> => {
    return api.post("/cart/items", { productId, quantity });
  },

  updateItem: async (itemId: string, quantity: number): Promise<CartItem> => {
    return api.put(`/cart/items/${itemId}`, { quantity });
  },

  removeItem: async (itemId: string): Promise<void> => {
    await api.delete(`/cart/items/${itemId}`);
  },

  clear: async (): Promise<void> => {
    await api.delete("/cart");
  },
};

// Wishlist API (for authenticated users)
export const wishlistApi = {
  get: async (): Promise<WishlistItem[]> => {
    return api.get("/wishlist");
  },

  addItem: async (productId: string): Promise<WishlistItem> => {
    return api.post("/wishlist/items", { productId });
  },

  removeItem: async (productId: string): Promise<void> => {
    await api.delete(`/wishlist/items/${productId}`);
  },
};

// Helper to extract error messages from API response
export const getApiErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
};

// Helper to get primary image URL
export const getPrimaryImageUrl = (product: Product): string => {
  const primary = product.images?.find(img => img.isPrimary);
  return primary?.url || product.images?.[0]?.url || "/placeholder.svg";
};

// Helper to get price in specific currency
export const getPrice = (product: Product, currencyCode: string): number => {
  const price = product.prices?.find(p => p.currencyCode === currencyCode);
  return price?.amount || product.prices?.[0]?.amount || 0;
};

export default api;
