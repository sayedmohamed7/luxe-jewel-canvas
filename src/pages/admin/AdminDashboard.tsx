import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, Users, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { adminApi, DashboardStats, Order } from "@/lib/adminApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for when API is not ready
const mockStats: DashboardStats = {
  totalProducts: 24,
  totalOrders: 156,
  totalUsers: 89,
  totalRevenue: 245000,
  recentOrders: [
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      customerId: "c1",
      customerName: "Sarah Ahmed",
      customerEmail: "sarah@example.com",
      items: [{ productId: "1", productName: "Éternité Diamond Ring", quantity: 1, price: 12500, image: "" }],
      totalAmount: 12500,
      currency: "AED",
      status: "pending",
      shippingAddress: { street: "123 Marina", city: "Dubai", emirate: "Dubai", postalCode: "00000", country: "UAE" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      orderNumber: "ORD-2024-002",
      customerId: "c2",
      customerName: "Fatima Hassan",
      customerEmail: "fatima@example.com",
      items: [{ productId: "2", productName: "Lumière Gold Bracelet", quantity: 1, price: 8900, image: "" }],
      totalAmount: 8900,
      currency: "AED",
      status: "paid",
      shippingAddress: { street: "456 JBR", city: "Dubai", emirate: "Dubai", postalCode: "00000", country: "UAE" },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      orderNumber: "ORD-2024-003",
      customerId: "c3",
      customerName: "Amira Khan",
      customerEmail: "amira@example.com",
      items: [{ productId: "4", productName: "Céleste Pendant Necklace", quantity: 1, price: 6800, image: "" }],
      totalAmount: 6800,
      currency: "AED",
      status: "shipped",
      shippingAddress: { street: "789 Downtown", city: "Abu Dhabi", emirate: "Abu Dhabi", postalCode: "00000", country: "UAE" },
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

export default function AdminDashboard() {
  const { direction } = useLanguage();
  const { formatPrice } = useCurrency();
  const isRTL = direction === "rtl";

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: adminApi.getDashboardStats,
    retry: 1,
  });

  // Use mock data if API fails
  const dashboardData = stats || mockStats;

  const kpis = [
    {
      label: isRTL ? "المنتجات" : "Products",
      value: dashboardData.totalProducts,
      icon: Package,
      trend: "+12%",
      trendUp: true,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: isRTL ? "الطلبات" : "Orders",
      value: dashboardData.totalOrders,
      icon: ShoppingCart,
      trend: "+8%",
      trendUp: true,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: isRTL ? "العملاء" : "Customers",
      value: dashboardData.totalUsers,
      icon: Users,
      trend: "+15%",
      trendUp: true,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: isRTL ? "الإيرادات" : "Revenue",
      value: formatPrice(dashboardData.totalRevenue),
      icon: DollarSign,
      trend: "+23%",
      trendUp: true,
      color: "text-primary",
      bgColor: "bg-primary/10",
      isPrice: true,
    },
  ];

  const getStatusBadge = (status: Order["status"]) => {
    const styles: Record<Order["status"], string> = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      paid: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    const labels: Record<Order["status"], { en: string; ar: string }> = {
      pending: { en: "Pending", ar: "قيد الانتظار" },
      paid: { en: "Paid", ar: "مدفوع" },
      shipped: { en: "Shipped", ar: "تم الشحن" },
      delivered: { en: "Delivered", ar: "تم التوصيل" },
      cancelled: { en: "Cancelled", ar: "ملغى" },
    };

    return (
      <Badge variant="outline" className={cn("border font-normal", styles[status])}>
        {labels[status][isRTL ? "ar" : "en"]}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout title="Dashboard" titleAr="لوحة التحكم">
        <LoadingScreen fullScreen={false} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard" titleAr="لوحة التحكم">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-background rounded-sm border border-border p-5 transition-shadow hover:shadow-soft"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
                <div className={cn(isRTL && "text-right")}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {kpi.label}
                  </p>
                  <p className="text-2xl font-serif">
                    {kpi.isPrice ? kpi.value : kpi.value.toLocaleString()}
                  </p>
                </div>
                <div className={cn("p-2.5 rounded-sm", kpi.bgColor)}>
                  <Icon className={cn("h-5 w-5", kpi.color)} />
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-1 mt-3 text-xs",
                isRTL && "flex-row-reverse"
              )}>
                {kpi.trendUp ? (
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-600" />
                )}
                <span className={kpi.trendUp ? "text-green-600" : "text-red-600"}>
                  {kpi.trend}
                </span>
                <span className="text-muted-foreground">
                  {isRTL ? "من الشهر الماضي" : "from last month"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-background rounded-sm border border-border">
        <div className={cn(
          "px-5 py-4 border-b border-border flex items-center justify-between",
          isRTL && "flex-row-reverse"
        )}>
          <h2 className="font-serif text-lg">
            {isRTL ? "الطلبات الأخيرة" : "Recent Orders"}
          </h2>
          <Link 
            to="/admin/orders" 
            className="text-xs text-primary hover:underline"
          >
            {isRTL ? "عرض الكل" : "View All"}
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "رقم الطلب" : "Order"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "العميل" : "Customer"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الحالة" : "Status"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "المبلغ" : "Amount"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "التاريخ" : "Date"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData.recentOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-hover-muted/50">
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div className={isRTL ? "text-right" : ""}>
                      <p className="text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(isRTL ? "ar-AE" : "en-AE")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {dashboardData.recentOrders.map((order) => (
            <div key={order.id} className="p-4">
              <div className={cn("flex items-start justify-between mb-2", isRTL && "flex-row-reverse")}>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="font-medium text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{order.customerName}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>
              <div className={cn("flex items-center justify-between text-sm", isRTL && "flex-row-reverse")}>
                <span className="font-medium">{formatPrice(order.totalAmount)}</span>
                <span className="text-muted-foreground text-xs">
                  {new Date(order.createdAt).toLocaleDateString(isRTL ? "ar-AE" : "en-AE")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
