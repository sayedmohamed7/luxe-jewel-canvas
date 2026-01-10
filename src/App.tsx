import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import Index from "./pages/Index";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminUsers from "./pages/admin/AdminUsers";
import ProfileSettings from "./pages/profile/ProfileSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/settings" element={
                    <ProtectedRoute>
                      <ProfileSettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/products" element={
                    <AdminProtectedRoute>
                      <AdminProducts />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/categories" element={
                    <AdminProtectedRoute>
                      <AdminCategories />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminProtectedRoute>
                      <AdminOrders />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/customers" element={
                    <AdminProtectedRoute>
                      <AdminCustomers />
                    </AdminProtectedRoute>
                  } />
                  <Route path="/admin/users" element={
                    <AdminProtectedRoute>
                      <AdminUsers />
                    </AdminProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
