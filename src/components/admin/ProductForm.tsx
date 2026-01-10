import React, { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export interface ProductFormData {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  priceAED: number;
  priceUSD: number;
  categoryId: string;
  status: "active" | "hidden";
  isCurated: boolean;
  images: ImagePreview[];
}

export interface ImagePreview {
  id: string;
  file?: File;
  url: string;
  isPrimary: boolean;
}

export interface CategoryOption {
  id: string;
  name: string;
  nameAr?: string;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  categories: CategoryOption[];
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
  mode: "create" | "edit";
}

export function ProductForm({
  initialData,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
  error = null,
  mode,
}: ProductFormProps) {
  const { t, direction } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    nameAr: initialData?.nameAr || "",
    description: initialData?.description || "",
    descriptionAr: initialData?.descriptionAr || "",
    priceAED: initialData?.priceAED || 0,
    priceUSD: initialData?.priceUSD || 0,
    categoryId: initialData?.categoryId || "",
    status: initialData?.status || "active",
    isCurated: initialData?.isCurated || false,
    images: initialData?.images || [],
  });

  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImagePreview[] = Array.from(files).map((file, index) => ({
      id: `new-${Date.now()}-${index}`,
      file,
      url: URL.createObjectURL(file),
      isPrimary: formData.images.length === 0 && index === 0,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removeImage = (id: string) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((img) => img.id !== id);
      // If removed image was primary, make first remaining image primary
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return { ...prev, images: filtered };
    });
  };

  const setPrimaryImage = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      })),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={direction}>
      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name (English)</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nameAr">Product Name (Arabic)</Label>
          <Input
            id="nameAr"
            name="nameAr"
            value={formData.nameAr}
            onChange={handleInputChange}
            placeholder="أدخل اسم المنتج"
            dir="rtl"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description (English)</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows={4}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="descriptionAr">Description (Arabic)</Label>
          <Textarea
            id="descriptionAr"
            name="descriptionAr"
            value={formData.descriptionAr}
            onChange={handleInputChange}
            placeholder="أدخل وصف المنتج"
            dir="rtl"
            rows={4}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priceAED">Price (AED)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              AED
            </span>
            <Input
              id="priceAED"
              name="priceAED"
              type="number"
              min="0"
              step="0.01"
              value={formData.priceAED}
              onChange={handleInputChange}
              className="pl-12"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceUSD">Price (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              USD
            </span>
            <Input
              id="priceUSD"
              name="priceUSD"
              type="number"
              min="0"
              step="0.01"
              value={formData.priceUSD}
              onChange={handleInputChange}
              className="pl-12"
              required
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Category & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, categoryId: value }))
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {direction === "rtl" && cat.nameAr ? cat.nameAr : cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: "active" | "hidden") =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Curated Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
        <div className="space-y-0.5">
          <Label htmlFor="curated" className="text-base">
            Featured Product
          </Label>
          <p className="text-sm text-muted-foreground">
            Show this product in curated collections
          </p>
        </div>
        <Switch
          id="curated"
          checked={formData.isCurated}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, isCurated: checked }))
          }
          disabled={isLoading}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <Label>Product Images</Label>

        {/* Drop Zone */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            isLoading && "opacity-50 pointer-events-none"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={isLoading}
          />
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            Drag & drop images here, or click to select
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG up to 10MB each
          </p>
        </div>

        {/* Image Previews */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.images.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "relative group rounded-lg overflow-hidden border-2 aspect-square",
                  image.isPrimary ? "border-primary" : "border-transparent"
                )}
              >
                <img
                  src={image.url}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isPrimary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimaryImage(image.id)}
                      disabled={isLoading}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(image.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {/* Primary Badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : mode === "create" ? (
            "Create Product"
          ) : (
            "Update Product"
          )}
        </Button>
      </div>
    </form>
  );
}
