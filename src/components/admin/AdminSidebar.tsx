import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { 
    key: "dashboard",
    icon: LayoutDashboard, 
    href: "/admin" 
  },
  { 
    key: "products",
    icon: Package, 
    href: "/admin/products" 
  },
  { 
    key: "categories",
    icon: FolderTree, 
    href: "/admin/categories" 
  },
  { 
    key: "orders",
    icon: ShoppingCart, 
    href: "/admin/orders" 
  },
  { 
    key: "customers",
    icon: Users, 
    href: "/admin/customers" 
  },
];

export function AdminSidebar() {
  const { logout, user } = useAuth();
  const { t, direction } = useLanguage();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const isRTL = direction === "rtl";

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  const getLabel = (key: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
      products: { en: "Products", ar: "المنتجات" },
      categories: { en: "Categories", ar: "الفئات" },
      orders: { en: "Orders", ar: "الطلبات" },
      customers: { en: "Customers", ar: "العملاء" },
    };
    return labels[key]?.[direction === "rtl" ? "ar" : "en"] || key;
  };

  return (
    <aside
      className={cn(
        "fixed top-0 bottom-0 z-40 flex flex-col bg-background border-border transition-all duration-300",
        isRTL ? "right-0 border-l" : "left-0 border-r",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className={cn(
        "h-16 flex items-center px-4 border-b border-border",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <Link 
          to="/admin" 
          className={cn(
            "flex items-center gap-2 transition-colors hover:text-primary",
            isRTL && "flex-row-reverse"
          )}
        >
          <Logo size="sm" className="text-primary" />
          {!collapsed && (
            <span className="font-serif text-lg tracking-wider whitespace-nowrap">
              LE BIJOU
            </span>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCollapsed(true)}
          >
            {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors duration-200",
                isRTL && "flex-row-reverse",
                active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-hover-muted hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? getLabel(item.key) : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span>{getLabel(item.key)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border space-y-1">
        <Link
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-muted-foreground hover:bg-hover-muted hover:text-foreground transition-colors duration-200",
            isRTL && "flex-row-reverse",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "View Store" : undefined}
        >
          <Store className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>{isRTL ? "عرض المتجر" : "View Store"}</span>}
        </Link>
        
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-destructive hover:bg-destructive/10 transition-colors duration-200",
            isRTL && "flex-row-reverse",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? t("auth.logout") : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>{t("auth.logout")}</span>}
        </button>
      </div>

      {/* Collapse Toggle (when collapsed) */}
      {collapsed && (
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="icon"
            className="w-full h-8"
            onClick={() => setCollapsed(false)}
          >
            {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </aside>
  );
}
