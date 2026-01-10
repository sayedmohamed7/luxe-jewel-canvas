import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { adminApi, Category } from "@/lib/adminApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Mock categories
const mockCategories: Category[] = [
  { id: "rings", name: "Rings", nameAr: "الخواتم", description: "Elegant rings collection", descriptionAr: "مجموعة الخواتم الأنيقة", productCount: 8, createdAt: new Date().toISOString() },
  { id: "necklaces", name: "Necklaces", nameAr: "القلائد", description: "Beautiful necklaces", descriptionAr: "قلائد جميلة", productCount: 12, createdAt: new Date().toISOString() },
  { id: "bracelets", name: "Bracelets", nameAr: "الأساور", description: "Stunning bracelets", descriptionAr: "أساور مذهلة", productCount: 6, createdAt: new Date().toISOString() },
  { id: "earrings", name: "Earrings", nameAr: "الأقراط", description: "Exquisite earrings", descriptionAr: "أقراط رائعة", productCount: 10, createdAt: new Date().toISOString() },
];

interface CategoryFormData {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
}

const initialFormData: CategoryFormData = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
};

export default function AdminCategories() {
  const { direction } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isRTL = direction === "rtl";

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: adminApi.getCategories,
    retry: 1,
  });

  const categoriesList = categories || mockCategories;

  const createMutation = useMutation({
    mutationFn: adminApi.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setIsCreateOpen(false);
      setFormData(initialFormData);
      toast({ title: isRTL ? "تم إنشاء الفئة" : "Category created successfully" });
    },
    onError: () => {
      toast({ 
        title: isRTL ? "فشل في إنشاء الفئة" : "Failed to create category",
        variant: "destructive"
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryFormData> }) =>
      adminApi.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setEditingCategory(null);
      setFormData(initialFormData);
      toast({ title: isRTL ? "تم تحديث الفئة" : "Category updated successfully" });
    },
    onError: () => {
      toast({ 
        title: isRTL ? "فشل في تحديث الفئة" : "Failed to update category",
        variant: "destructive"
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      setDeletingCategory(null);
      toast({ title: isRTL ? "تم حذف الفئة" : "Category deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: isRTL ? "فشل في حذف الفئة" : "Failed to delete category",
        variant: "destructive"
      });
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameAr: category.nameAr || "",
      description: category.description || "",
      descriptionAr: category.descriptionAr || "",
    });
  };

  const handleSubmit = () => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (deletingCategory) {
      deleteMutation.mutate(deletingCategory.id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Categories" titleAr="الفئات">
        <LoadingScreen fullScreen={false} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories" titleAr="الفئات">
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between mb-6",
        isRTL && "flex-row-reverse"
      )}>
        <p className="text-muted-foreground text-sm">
          {isRTL 
            ? `${categoriesList.length} فئات`
            : `${categoriesList.length} categories`
          }
        </p>
        <Button
          variant="luxury"
          onClick={() => {
            setFormData(initialFormData);
            setIsCreateOpen(true);
          }}
          className={cn(isRTL && "flex-row-reverse")}
        >
          <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {isRTL ? "إضافة فئة" : "Add Category"}
        </Button>
      </div>

      {/* Categories Table / Cards */}
      <div className="bg-background rounded-sm border border-border">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الفئة" : "Category"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الوصف" : "Description"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "المنتجات" : "Products"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesList.map((category) => (
                <TableRow key={category.id} className="hover:bg-hover-muted/50">
                  <TableCell>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      <div className="h-10 w-10 bg-primary/10 rounded-sm flex items-center justify-center">
                        <FolderTree className="h-4 w-4 text-primary" />
                      </div>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="font-medium text-sm">{category.name}</p>
                        {category.nameAr && (
                          <p className="text-xs text-muted-foreground">{category.nameAr}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {isRTL && category.descriptionAr ? category.descriptionAr : category.description || "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{category.productCount}</span>
                  </TableCell>
                  <TableCell>
                    <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-hover-muted"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                        onClick={() => setDeletingCategory(category)}
                        disabled={category.productCount > 0}
                        title={category.productCount > 0 
                          ? (isRTL ? "لا يمكن حذف فئة تحتوي على منتجات" : "Cannot delete category with products")
                          : undefined
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-border">
          {categoriesList.map((category) => (
            <div key={category.id} className="p-4">
              <div className={cn("flex items-start justify-between", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                  <div className="h-10 w-10 bg-primary/10 rounded-sm flex items-center justify-center">
                    <FolderTree className="h-4 w-4 text-primary" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <p className="font-medium text-sm">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.productCount} {isRTL ? "منتج" : "products"}
                    </p>
                  </div>
                </div>
                <div className={cn("flex gap-1", isRTL && "flex-row-reverse")}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(category)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeletingCategory(category)}
                    disabled={category.productCount > 0}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categoriesList.length === 0 && (
          <div className="text-center py-12">
            <FolderTree className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isRTL ? "لا توجد فئات" : "No categories found"}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={isCreateOpen || !!editingCategory} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingCategory(null);
            setFormData(initialFormData);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingCategory 
                ? (isRTL ? "تعديل الفئة" : "Edit Category")
                : (isRTL ? "إضافة فئة جديدة" : "Add New Category")
              }
            </DialogTitle>
            <DialogDescription>
              {isRTL 
                ? "أدخل تفاصيل الفئة أدناه"
                : "Enter the category details below"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isRTL ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "الاسم (عربي)" : "Name (Arabic)"}</Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="اسم الفئة"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
              <Textarea
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                placeholder="وصف الفئة"
                dir="rtl"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <Button
              variant="luxury-outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingCategory(null);
                setFormData(initialFormData);
              }}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="luxury"
              onClick={handleSubmit}
              disabled={!formData.name || createMutation.isPending || updateMutation.isPending}
            >
              {editingCategory 
                ? (isRTL ? "تحديث" : "Update")
                : (isRTL ? "إنشاء" : "Create")
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog 
        open={!!deletingCategory} 
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? "حذف الفئة" : "Delete Category"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL 
                ? `هل أنت متأكد من حذف "${deletingCategory?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRTL ? "حذف" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
