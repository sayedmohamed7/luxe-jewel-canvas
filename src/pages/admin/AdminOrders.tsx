import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Eye, Package } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { adminApi, Order } from "@/lib/adminApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock orders
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerId: "c1",
    customerName: "Sarah Ahmed",
    customerEmail: "sarah@example.com",
    items: [
      { productId: "1", productName: "Éternité Diamond Ring", quantity: 1, price: 12500, image: "" },
    ],
    totalAmount: 12500,
    currency: "AED",
    status: "pending",
    shippingAddress: { street: "123 Marina Walk", city: "Dubai", emirate: "Dubai", postalCode: "00000", country: "UAE" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerId: "c2",
    customerName: "Fatima Hassan",
    customerEmail: "fatima@example.com",
    items: [
      { productId: "2", productName: "Lumière Gold Bracelet", quantity: 1, price: 8900, image: "" },
      { productId: "3", productName: "Perle Drop Earrings", quantity: 2, price: 4200, image: "" },
    ],
    totalAmount: 17300,
    currency: "AED",
    status: "paid",
    shippingAddress: { street: "456 JBR Tower", city: "Dubai", emirate: "Dubai", postalCode: "00000", country: "UAE" },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerId: "c3",
    customerName: "Amira Khan",
    customerEmail: "amira@example.com",
    items: [
      { productId: "4", productName: "Céleste Pendant Necklace", quantity: 1, price: 6800, image: "" },
    ],
    totalAmount: 6800,
    currency: "AED",
    status: "shipped",
    shippingAddress: { street: "789 Downtown Boulevard", city: "Abu Dhabi", emirate: "Abu Dhabi", postalCode: "00000", country: "UAE" },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customerId: "c4",
    customerName: "Layla Mohammed",
    customerEmail: "layla@example.com",
    items: [
      { productId: "1", productName: "Éternité Diamond Ring", quantity: 1, price: 12500, image: "" },
    ],
    totalAmount: 12500,
    currency: "AED",
    status: "delivered",
    shippingAddress: { street: "321 Al Wasl Road", city: "Dubai", emirate: "Dubai", postalCode: "00000", country: "UAE" },
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function AdminOrders() {
  const { direction } = useLanguage();
  const { formatPrice } = useCurrency();
  const isRTL = direction === "rtl";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: adminApi.getOrders,
    retry: 1,
  });

  const ordersList = orders || mockOrders;

  const filteredOrders = ordersList.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const statusOptions = [
    { value: "all", label: isRTL ? "جميع الحالات" : "All Status" },
    { value: "pending", label: isRTL ? "قيد الانتظار" : "Pending" },
    { value: "paid", label: isRTL ? "مدفوع" : "Paid" },
    { value: "shipped", label: isRTL ? "تم الشحن" : "Shipped" },
    { value: "delivered", label: isRTL ? "تم التوصيل" : "Delivered" },
    { value: "cancelled", label: isRTL ? "ملغى" : "Cancelled" },
  ];

  if (isLoading) {
    return (
      <AdminLayout title="Orders" titleAr="الطلبات">
        <LoadingScreen fullScreen={false} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Orders" titleAr="الطلبات">
      {/* Filters */}
      <div className={cn(
        "flex flex-col sm:flex-row gap-4 mb-6",
        isRTL && "sm:flex-row-reverse"
      )}>
        <div className="relative flex-1 max-w-md">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
            isRTL ? "right-3" : "left-3"
          )} />
          <Input
            placeholder={isRTL ? "البحث عن الطلبات..." : "Search orders..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn("bg-background", isRTL ? "pr-10" : "pl-10")}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table / Cards */}
      <div className="bg-background rounded-sm border border-border">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "رقم الطلب" : "Order"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "العميل" : "Customer"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "المنتجات" : "Items"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "المبلغ" : "Amount"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الحالة" : "Status"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "التاريخ" : "Date"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-hover-muted/50">
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div className={isRTL ? "text-right" : ""}>
                      <p className="text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {order.items.length} {isRTL ? "منتج" : order.items.length === 1 ? "item" : "items"}
                    </span>
                  </TableCell>
                  <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(order.createdAt).toLocaleDateString(isRTL ? "ar-AE" : "en-AE")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-hover-muted"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="p-4 cursor-pointer hover:bg-hover-muted/50 transition-colors"
              onClick={() => setSelectedOrder(order)}
            >
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isRTL ? "لا توجد طلبات" : "No orders found"}
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {isRTL ? "تفاصيل الطلب" : "Order Details"}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className={cn(
                "flex items-start justify-between",
                isRTL && "flex-row-reverse"
              )}>
                <div className={isRTL ? "text-right" : ""}>
                  <p className="font-medium">{selectedOrder.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedOrder.createdAt).toLocaleDateString(isRTL ? "ar-AE" : "en-AE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Customer Info */}
              <div className="border-t border-border pt-4">
                <h4 className={cn("font-medium mb-2", isRTL && "text-right")}>
                  {isRTL ? "معلومات العميل" : "Customer Information"}
                </h4>
                <div className={cn("text-sm space-y-1", isRTL && "text-right")}>
                  <p>{selectedOrder.customerName}</p>
                  <p className="text-muted-foreground">{selectedOrder.customerEmail}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-border pt-4">
                <h4 className={cn("font-medium mb-2", isRTL && "text-right")}>
                  {isRTL ? "عنوان الشحن" : "Shipping Address"}
                </h4>
                <div className={cn("text-sm text-muted-foreground", isRTL && "text-right")}>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.emirate}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-border pt-4">
                <h4 className={cn("font-medium mb-3", isRTL && "text-right")}>
                  {isRTL ? "المنتجات" : "Order Items"}
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "flex items-center justify-between py-2",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                        <div className="h-12 w-12 bg-champagne rounded-sm" />
                        <div className={isRTL ? "text-right" : ""}>
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">
                            {isRTL ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className={cn(
                "border-t border-border pt-4 flex items-center justify-between",
                isRTL && "flex-row-reverse"
              )}>
                <span className="font-medium">
                  {isRTL ? "المجموع" : "Total"}
                </span>
                <span className="font-serif text-xl">
                  {formatPrice(selectedOrder.totalAmount)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
