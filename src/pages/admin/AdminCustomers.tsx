import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Users, Mail } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { adminApi, Customer } from "@/lib/adminApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock customers
const mockCustomers: Customer[] = [
  {
    id: "1",
    email: "sarah@example.com",
    firstName: "Sarah",
    lastName: "Ahmed",
    ordersCount: 5,
    totalSpent: 48500,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "2",
    email: "fatima@example.com",
    firstName: "Fatima",
    lastName: "Hassan",
    ordersCount: 3,
    totalSpent: 26700,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: "3",
    email: "amira@example.com",
    firstName: "Amira",
    lastName: "Khan",
    ordersCount: 2,
    totalSpent: 19300,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: "4",
    email: "layla@example.com",
    firstName: "Layla",
    lastName: "Mohammed",
    ordersCount: 8,
    totalSpent: 75200,
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: "5",
    email: "nadia@example.com",
    firstName: "Nadia",
    lastName: "Rahman",
    ordersCount: 1,
    totalSpent: 12500,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

export default function AdminCustomers() {
  const { direction } = useLanguage();
  const { formatPrice } = useCurrency();
  const isRTL = direction === "rtl";

  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: adminApi.getCustomers,
    retry: 1,
  });

  const customersList = customers || mockCustomers;

  const filteredCustomers = customersList.filter((customer) =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <AdminLayout title="Customers" titleAr="العملاء">
        <LoadingScreen fullScreen={false} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Customers" titleAr="العملاء">
      {/* Search */}
      <div className={cn("mb-6", isRTL && "text-right")}>
        <div className="relative max-w-md">
          <Search className={cn(
            "absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground",
            isRTL ? "right-3" : "left-3"
          )} />
          <Input
            placeholder={isRTL ? "البحث عن العملاء..." : "Search customers..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn("bg-background", isRTL ? "pr-10" : "pl-10")}
          />
        </div>
      </div>

      {/* Customers Table / Cards */}
      <div className="bg-background rounded-sm border border-border">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "العميل" : "Customer"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "البريد الإلكتروني" : "Email"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الطلبات" : "Orders"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "إجمالي الإنفاق" : "Total Spent"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "تاريخ التسجيل" : "Joined"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-hover-muted/50">
                  <TableCell>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </span>
                      </div>
                      <span className="font-medium text-sm">
                        {customer.firstName} {customer.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {customer.email}
                  </TableCell>
                  <TableCell>{customer.ordersCount}</TableCell>
                  <TableCell>{formatPrice(customer.totalSpent)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(customer.createdAt).toLocaleDateString(isRTL ? "ar-AE" : "en-AE")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-4">
              <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">
                    {customer.firstName[0]}{customer.lastName[0]}
                  </span>
                </div>
                <div className={cn("flex-1", isRTL && "text-right")}>
                  <p className="font-medium text-sm">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {customer.email}
                  </p>
                  <div className={cn(
                    "flex items-center gap-4 mt-2 text-xs",
                    isRTL && "flex-row-reverse"
                  )}>
                    <span>
                      {customer.ordersCount} {isRTL ? "طلبات" : "orders"}
                    </span>
                    <span className="font-medium">
                      {formatPrice(customer.totalSpent)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isRTL ? "لا يوجد عملاء" : "No customers found"}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
