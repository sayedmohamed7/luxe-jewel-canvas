import React, { useState } from "react";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productNameAr?: string;
  image: string;
  quantity: number;
  price: number;
  currency: string;
}

export interface OrderAddress {
  street: string;
  city: string;
  emirate: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  shippingAddress: OrderAddress;
  createdAt: string;
  updatedAt: string;
}

interface OrdersTabProps {
  orders: Order[];
  isLoading?: boolean;
  error?: string | null;
  onViewOrder?: (orderId: string) => void;
}

const statusConfig: Record<
  OrderStatus,
  { icon: React.ElementType; color: string; label: string; labelAr: string }
> = {
  pending: {
    icon: Clock,
    color: "bg-amber-500/10 text-amber-600 border-amber-200",
    label: "Pending",
    labelAr: "قيد الانتظار",
  },
  paid: {
    icon: CheckCircle2,
    color: "bg-blue-500/10 text-blue-600 border-blue-200",
    label: "Paid",
    labelAr: "مدفوع",
  },
  shipped: {
    icon: Truck,
    color: "bg-purple-500/10 text-purple-600 border-purple-200",
    label: "Shipped",
    labelAr: "تم الشحن",
  },
  delivered: {
    icon: CheckCircle2,
    color: "bg-green-500/10 text-green-600 border-green-200",
    label: "Delivered",
    labelAr: "تم التوصيل",
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-500/10 text-red-600 border-red-200",
    label: "Cancelled",
    labelAr: "ملغي",
  },
};

export function OrdersTab({
  orders,
  isLoading = false,
  error = null,
  onViewOrder,
}: OrdersTabProps) {
  const { direction, language } = useLanguage();
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "ar" ? "ar-AE" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-AE" : "en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {language === "ar" ? "جارٍ تحميل الطلبات..." : "Loading orders..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <XCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {language === "ar" ? "لا توجد طلبات" : "No orders yet"}
        </h3>
        <p className="text-muted-foreground max-w-sm">
          {language === "ar"
            ? "عندما تقوم بطلب، ستظهر طلباتك هنا"
            : "When you place an order, it will appear here"}
        </p>
        <Button className="mt-6" asChild>
          <a href="/collections">
            {language === "ar" ? "تسوق الآن" : "Start Shopping"}
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir={direction}>
      {orders.map((order) => {
        const isExpanded = expandedOrders.includes(order.id);
        const StatusIcon = statusConfig[order.status].icon;

        return (
          <div
            key={order.id}
            className="border rounded-lg overflow-hidden bg-card"
          >
            {/* Order Header */}
            <div
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => toggleExpand(order.id)}
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">
                      {language === "ar" ? "طلب" : "Order"} #{order.orderNumber}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn("gap-1.5", statusConfig[order.status].color)}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {language === "ar"
                        ? statusConfig[order.status].labelAr
                        : statusConfig[order.status].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(order.createdAt)} • {order.items.length}{" "}
                    {language === "ar"
                      ? order.items.length === 1
                        ? "منتج"
                        : "منتجات"
                      : order.items.length === 1
                      ? "item"
                      : "items"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">
                    {formatCurrency(order.totalAmount, order.currency)}
                  </p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t bg-muted/20">
                {/* Order Items */}
                <div className="p-4 space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    {language === "ar" ? "المنتجات" : "Items"}
                  </h4>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-background"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.productName}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {language === "ar" && item.productNameAr
                            ? item.productNameAr
                            : item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === "ar" ? "الكمية:" : "Qty:"} {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.price * item.quantity, item.currency)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="p-4 border-t">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {language === "ar" ? "عنوان الشحن" : "Shipping Address"}
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.emirate}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrder?.(order.id);
                    }}
                  >
                    {language === "ar" ? "عرض التفاصيل" : "View Details"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
