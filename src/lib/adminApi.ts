import api from "./api";

// Types
export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  priceAED: number;
  priceUSD: number;
  category: string;
  categoryId: string;
  images: string[];
  status: "active" | "hidden";
  isCurated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  productCount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  emirate: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export interface CreateProductData {
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  priceAED: number;
  priceUSD: number;
  categoryId: string;
  images: string[];
  status: "active" | "hidden";
  isCurated: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

export interface CreateCategoryData {
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  id: string;
}

// Admin API endpoints
export const adminApi = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>("/admin/dashboard");
    return response.data;
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/admin/products");
    return response.data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post<Product>("/admin/products", data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<CreateProductData>): Promise<Product> => {
    const response = await api.put<Product>(`/admin/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/admin/categories");
    return response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/admin/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post<Category>("/admin/categories", data);
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<CreateCategoryData>): Promise<Category> => {
    const response = await api.put<Category>(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>("/admin/orders");
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    const response = await api.patch<Order>(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>("/admin/customers");
    return response.data;
  },

  getCustomer: async (id: string): Promise<Customer> => {
    const response = await api.get<Customer>(`/admin/customers/${id}`);
    return response.data;
  },
};
