import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { UserManagement, UserData } from "@/components/admin/UserManagement";
import { toast } from "sonner";

// Mock data for UI demonstration
const mockUsers: UserData[] = [
  {
    id: "1",
    email: "admin@lebijou.com",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "Admin",
    ordersCount: 0,
    totalSpent: 0,
    createdAt: "2024-01-15T10:00:00Z",
    lastLoginAt: "2024-12-20T14:30:00Z",
  },
  {
    id: "2",
    email: "support@lebijou.com",
    firstName: "Ahmed",
    lastName: "Hassan",
    role: "Moderator",
    ordersCount: 0,
    totalSpent: 0,
    createdAt: "2024-03-10T08:00:00Z",
    lastLoginAt: "2024-12-19T09:15:00Z",
  },
  {
    id: "3",
    email: "emma.wilson@example.com",
    firstName: "Emma",
    lastName: "Wilson",
    role: "Customer",
    ordersCount: 12,
    totalSpent: 8450,
    createdAt: "2024-02-20T11:30:00Z",
    lastLoginAt: "2024-12-18T16:45:00Z",
  },
  {
    id: "4",
    email: "fatima.ali@example.com",
    firstName: "Fatima",
    lastName: "Ali",
    role: "Customer",
    ordersCount: 8,
    totalSpent: 5200,
    createdAt: "2024-04-05T09:00:00Z",
    lastLoginAt: "2024-12-17T11:20:00Z",
  },
  {
    id: "5",
    email: "james.brown@example.com",
    firstName: "James",
    lastName: "Brown",
    role: "Customer",
    ordersCount: 3,
    totalSpent: 1850,
    createdAt: "2024-06-12T14:15:00Z",
    lastLoginAt: "2024-12-15T08:00:00Z",
  },
  {
    id: "6",
    email: "layla.mohammed@example.com",
    firstName: "Layla",
    lastName: "Mohammed",
    role: "Customer",
    ordersCount: 15,
    totalSpent: 12300,
    createdAt: "2024-01-28T16:00:00Z",
    lastLoginAt: "2024-12-20T10:30:00Z",
  },
];

export default function AdminUsers() {
  const handleRoleChange = (userId: string, newRole: string) => {
    // UI-only handler - would connect to API
    toast.success(`Role updated successfully`);
    console.log("Role change:", { userId, newRole });
  };

  const handleResetPassword = (userId: string) => {
    // UI-only handler - would connect to API
    toast.success("Password reset email sent");
    console.log("Reset password for:", userId);
  };

  return (
    <AdminLayout title="Users Management" titleAr="إدارة المستخدمين">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif font-semibold">Users</h2>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        <UserManagement
          users={mockUsers}
          onRoleChange={handleRoleChange}
          onResetPassword={handleResetPassword}
        />
      </div>
    </AdminLayout>
  );
}
