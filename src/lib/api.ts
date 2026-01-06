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

export default api;
