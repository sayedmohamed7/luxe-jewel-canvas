import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:5240/api";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
      // Optionally redirect to login
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", credentials);
    return response.data;
  },

  // OAuth endpoints - redirects to backend
  googleLoginUrl: `${API_BASE_URL}/auth/google-login`,
  microsoftLoginUrl: `${API_BASE_URL}/auth/microsoft-login`,

  // Validate token
  validateToken: async (): Promise<boolean> => {
    try {
      await api.get("/auth/validate");
      return true;
    } catch {
      return false;
    }
  },
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
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/category/${category}`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories");
    return response.data;
  },
};

// Cart API (for authenticated users)
export const cartApi = {
  get: async (): Promise<CartItem[]> => {
    const response = await api.get<CartItem[]>("/cart");
    return response.data;
  },

  addItem: async (productId: string, quantity: number = 1): Promise<CartItem> => {
    const response = await api.post<CartItem>("/cart/items", { productId, quantity });
    return response.data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<CartItem> => {
    const response = await api.put<CartItem>(`/cart/items/${itemId}`, { quantity });
    return response.data;
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
    const response = await api.get<WishlistItem[]>("/wishlist");
    return response.data;
  },

  addItem: async (productId: string): Promise<WishlistItem> => {
    const response = await api.post<WishlistItem>("/wishlist/items", { productId });
    return response.data;
  },

  removeItem: async (productId: string): Promise<void> => {
    await api.delete(`/wishlist/items/${productId}`);
  },
};

// Helper to extract error messages from API response
export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    const data = axiosError.response?.data;
    
    // Check for validation errors object
    if (data?.errors) {
      const messages = Object.values(data.errors).flat();
      return messages.join(". ");
    }
    
    // Check for message property
    if (data?.message) {
      return data.message;
    }
    
    // Fallback to status text
    if (axiosError.response?.statusText) {
      return axiosError.response.statusText;
    }
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
