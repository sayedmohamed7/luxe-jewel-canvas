import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authApi, LoginCredentials, RegisterCredentials, getApiErrorMessage } from "@/lib/api";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  handleOAuthCallback: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decode JWT token to extract user info
function decodeJwt(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    
    return {
      id: payload.sub || payload.userId || payload.nameid || "",
      email: payload.email || payload.unique_name || "",
      firstName: payload.firstName || payload.given_name || "",
      lastName: payload.lastName || payload.family_name || "",
      role: payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Customer",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        setUser(decoded);
      } else {
        // Invalid token, clear it
        localStorage.removeItem("jwt_token");
      }
    }
    setIsLoading(false);
  }, []);

  // Check for OAuth callback token in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      handleOAuthCallback(token);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleOAuthCallback = useCallback((token: string) => {
    localStorage.setItem("jwt_token", token);
    const decoded = decodeJwt(token);
    if (decoded) {
      setUser(decoded);
      // Redirect to home
      window.location.href = "/";
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem("jwt_token", response.token);
      
      const decoded = decodeJwt(response.token);
      if (decoded) {
        setUser(decoded);
      }
      
      return { success: true };
    } catch (error) {
      const message = getApiErrorMessage(error);
      return { success: false, error: message };
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.register(credentials);
      localStorage.setItem("jwt_token", response.token);
      
      const decoded = decodeJwt(response.token);
      if (decoded) {
        setUser(decoded);
      }
      
      return { success: true };
    } catch (error) {
      const message = getApiErrorMessage(error);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        handleOAuthCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
