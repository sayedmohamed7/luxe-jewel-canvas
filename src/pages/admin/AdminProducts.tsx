import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Eye, EyeOff, Star } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { adminApi, Product } from "@/lib/adminApi";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock products for development
import { products as mockProducts } from "@/data/products";

const convertedMockProducts: Product[] = mockProducts.map(p => ({
  id: p.id,
  name: p.name,
  description: p.description,
  priceAED: p.price,
  priceUSD: Math.round(p.price * 0.27),
  category: p.category,
  categoryId: p.category.toLowerCase(),
  images: p.images || [p.image],
  status: "active" as const,
  isCurated: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

interface ProductFormData {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  priceAED: number;
  priceUSD: number;
  categoryId: string;
  images: string[];
  status: "active" | "hidden";
  isCurated: boolean;
}

const initialFormData: ProductFormData = {
  name: "",
  nameAr: "",
  description: "",
  descriptionAr: "",
  priceAED: 0,
  priceUSD: 0,
  categoryId: "",
  images: [],
  status: "active",
  isCurated: false,
};

export default function AdminProducts() {
  const { direction } = useLanguage();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isRTL = direction === "rtl";

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: adminApi.getProducts,
    retry: 1,
  });

  const { data: categories } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: adminApi.getCategories,
    retry: 1,
  });

  // Use mock data if API fails
  const productsList = products || convertedMockProducts;
  const categoriesList = categories || [
    { id: "rings", name: "Rings", nameAr: "الخواتم", productCount: 0, createdAt: "" },
    { id: "necklaces", name: "Necklaces", nameAr: "القلائد", productCount: 0, createdAt: "" },
    { id: "bracelets", name: "Bracelets", nameAr: "الأساور", productCount: 0, createdAt: "" },
    { id: "earrings", name: "Earrings", nameAr: "الأقراط", productCount: 0, createdAt: "" },
  ];

  const createMutation = useMutation({
    mutationFn: adminApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setIsCreateOpen(false);
      setFormData(initialFormData);
      toast({ title: isRTL ? "تم إنشاء المنتج" : "Product created successfully" });
    },
    onError: () => {
      toast({ 
        title: isRTL ? "فشل في إنشاء المنتج" : "Failed to create product",
        variant: "destructive"
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) =>
      adminApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setEditingProduct(null);
      setFormData(initialFormData);
      toast({ title: isRTL ? "تم تحديث المنتج" : "Product updated successfully" });
    },
    onError: () => {
      toast({ 
        title: isRTL ? "فشل في تحديث المنتج" : "Failed to update product",
        variant: "destructive"
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setDeletingProduct(null);
      toast({ title: isRTL ? "تم حذف المنتج" : "Product deleted successfully" });
    },
    onError: () => {
      toast({ 
        title: isRTL ? "فشل في حذف المنتج" : "Failed to delete product",
        variant: "destructive"
      });
    },
  });

  const filteredProducts = productsList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      nameAr: product.nameAr || "",
      description: product.description,
      descriptionAr: product.descriptionAr || "",
      priceAED: product.priceAED,
      priceUSD: product.priceUSD,
      categoryId: product.categoryId,
      images: product.images,
      status: product.status,
      isCurated: product.isCurated,
    });
  };

  const handleSubmit = () => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = () => {
    if (deletingProduct) {
      deleteMutation.mutate(deletingProduct.id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Products" titleAr="المنتجات">
        <LoadingScreen fullScreen={false} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Products" titleAr="المنتجات">
      {/* Header Actions */}
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
            placeholder={isRTL ? "البحث عن المنتجات..." : "Search products..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn("bg-background", isRTL ? "pr-10" : "pl-10")}
          />
        </div>
        <Button
          variant="luxury"
          onClick={() => {
            setFormData(initialFormData);
            setIsCreateOpen(true);
          }}
          className={cn(isRTL && "flex-row-reverse")}
        >
          <Plus className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
          {isRTL ? "إضافة منتج" : "Add Product"}
        </Button>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-background rounded-sm border border-border">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "المنتج" : "Product"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الفئة" : "Category"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "السعر" : "Price"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الحالة" : "Status"}</TableHead>
                <TableHead className={isRTL ? "text-right" : ""}>{isRTL ? "الإجراءات" : "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-hover-muted/50">
                  <TableCell>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      <div className="h-12 w-12 bg-champagne rounded-sm overflow-hidden flex-shrink-0">
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className={isRTL ? "text-right" : ""}>
                        <p className="font-medium text-sm flex items-center gap-1.5">
                          {product.name}
                          {product.isCurated && (
                            <Star className="h-3 w-3 text-primary fill-primary" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{formatPrice(product.priceAED)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "border font-normal",
                        product.status === "active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      )}
                    >
                      {product.status === "active" ? (
                        <Eye className="h-3 w-3 mr-1" />
                      ) : (
                        <EyeOff className="h-3 w-3 mr-1" />
                      )}
                      {product.status === "active" 
                        ? (isRTL ? "نشط" : "Active")
                        : (isRTL ? "مخفي" : "Hidden")
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-hover-muted"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 text-destructive"
                        onClick={() => setDeletingProduct(product)}
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
          {filteredProducts.map((product) => (
            <div key={product.id} className="p-4">
              <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                <div className="h-16 w-16 bg-champagne rounded-sm overflow-hidden flex-shrink-0">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className={cn("flex-1 min-w-0", isRTL && "text-right")}>
                  <p className="font-medium text-sm flex items-center gap-1.5">
                    {product.name}
                    {product.isCurated && (
                      <Star className="h-3 w-3 text-primary fill-primary" />
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{product.category}</p>
                  <p className="text-sm font-medium mt-1">{formatPrice(product.priceAED)}</p>
                </div>
                <div className={cn("flex gap-1", isRTL && "flex-row-reverse")}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeletingProduct(product)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {isRTL ? "لا توجد منتجات" : "No products found"}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={isCreateOpen || !!editingProduct} 
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingProduct(null);
            setFormData(initialFormData);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {editingProduct 
                ? (isRTL ? "تعديل المنتج" : "Edit Product")
                : (isRTL ? "إضافة منتج جديد" : "Add New Product")
              }
            </DialogTitle>
            <DialogDescription>
              {isRTL 
                ? "أدخل تفاصيل المنتج أدناه"
                : "Enter the product details below"
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
                  placeholder="Product name"
                />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "الاسم (عربي)" : "Name (Arabic)"}</Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="اسم المنتج"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isRTL ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
                <Textarea
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  placeholder="وصف المنتج"
                  dir="rtl"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{isRTL ? "السعر (درهم)" : "Price (AED)"}</Label>
                <Input
                  type="number"
                  value={formData.priceAED}
                  onChange={(e) => setFormData({ ...formData, priceAED: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "السعر (دولار)" : "Price (USD)"}</Label>
                <Input
                  type="number"
                  value={formData.priceUSD}
                  onChange={(e) => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "الفئة" : "Category"}</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? "اختر الفئة" : "Select category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesList.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {isRTL && cat.nameAr ? cat.nameAr : cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{isRTL ? "الحالة" : "Status"}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "hidden") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{isRTL ? "نشط" : "Active"}</SelectItem>
                    <SelectItem value="hidden">{isRTL ? "مخفي" : "Hidden"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{isRTL ? "منتج مميز" : "Curated Product"}</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={formData.isCurated}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, isCurated: checked })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.isCurated 
                      ? (isRTL ? "مميز" : "Featured")
                      : (isRTL ? "عادي" : "Regular")
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{isRTL ? "روابط الصور" : "Image URLs"}</Label>
              <Textarea
                value={formData.images.join("\n")}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  images: e.target.value.split("\n").filter(Boolean)
                })}
                placeholder={isRTL ? "رابط صورة واحد في كل سطر" : "One image URL per line"}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {isRTL 
                  ? "أدخل رابط صورة واحد في كل سطر (Cloudinary أو أي رابط صورة)"
                  : "Enter one image URL per line (Cloudinary or any image URL)"
                }
              </p>
            </div>
          </div>

          <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <Button
              variant="luxury-outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingProduct(null);
                setFormData(initialFormData);
              }}
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="luxury"
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingProduct 
                ? (isRTL ? "تحديث" : "Update")
                : (isRTL ? "إنشاء" : "Create")
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog 
        open={!!deletingProduct} 
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? "حذف المنتج" : "Delete Product"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL 
                ? `هل أنت متأكد من حذف "${deletingProduct?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`
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
