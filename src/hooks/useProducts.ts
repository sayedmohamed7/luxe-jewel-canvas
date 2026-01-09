import { useState, useEffect, useCallback } from "react";
import { productsApi, categoriesApi, Product, Category, getPrimaryImageUrl, getPrice } from "@/lib/api";

interface UseProductsOptions {
  category?: string;
}

interface UseProductsResult {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch products and categories in parallel
      const [productsData, categoriesData] = await Promise.all([
        options.category && options.category !== "All"
          ? productsApi.getByCategory(options.category)
          : productsApi.getAll(),
        categoriesApi.getAll(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [options.category]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    products,
    categories,
    isLoading,
    error,
    refetch: fetchData,
  };
}

// Helper hook for single product
export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await productsApi.getById(productId);
      setProduct(data);
    } catch (err) {
      console.error("Failed to fetch product:", err);
      setError("Failed to load product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}

// Re-export helpers
export { getPrimaryImageUrl, getPrice };
