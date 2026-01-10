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
    return api.get("/admin/dashboard");
  },

  // Products
  getProducts: async (): Promise<Product[]> => {
    return api.get("/admin/products");
  },

  getProduct: async (id: string): Promise<Product> => {
    return api.get(`/admin/products/${id}`);
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    return api.post("/admin/products", data);
  },

  updateProduct: async (id: string, data: Partial<CreateProductData>): Promise<Product> => {
    return api.put(`/admin/products/${id}`, data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    return api.get("/admin/categories");
  },

  getCategory: async (id: string): Promise<Category> => {
    return api.get(`/admin/categories/${id}`);
  },

  createCategory: async (data: CreateCategoryData): Promise<Category> => {
    return api.post("/admin/categories", data);
  },

  updateCategory: async (id: string, data: Partial<CreateCategoryData>): Promise<Category> => {
    return api.put(`/admin/categories/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    return api.get("/admin/orders");
  },

  getOrder: async (id: string): Promise<Order> => {
    return api.get(`/admin/orders/${id}`);
  },

  updateOrderStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    return api.put(`/admin/orders/${id}/status`, { status });
  },

  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    return api.get("/admin/customers");
  },

  getCustomer: async (id: string): Promise<Customer> => {
    return api.get(`/admin/customers/${id}`);
  },
};
