import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard, ProductCardData } from "@/components/ProductCard";
import { ProductGridSkeleton } from "@/components/ProductSkeleton";
import { useProducts, getPrimaryImageUrl, getPrice } from "@/hooks/useProducts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Collections() {
  const { t, direction, language } = useLanguage();
  const { currency } = useCurrency();
  const isRTL = direction === "rtl";
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");

  // Fetch products from backend API
  const { products: apiProducts, categories: apiCategories, isLoading, error, refetch } = useProducts();

  // Map API products to ProductCardData format
  const products: ProductCardData[] = useMemo(() => {
    return apiProducts.map((p) => ({
      id: p.id,
      name: p.name,
      nameAr: p.nameAr,
      price: getPrice(p, "AED"),
      priceUSD: getPrice(p, "USD"),
      category: p.category,
      categoryAr: p.categoryAr,
      image: getPrimaryImageUrl(p),
      images: p.images?.map((img) => img.url) || [],
      description: p.description,
    }));
  }, [apiProducts]);

  // Build categories list from API
  const categories = useMemo(() => {
    const categoryNames = ["All", ...apiCategories.map((c) => c.name)];
    return categoryNames;
  }, [apiCategories]);

  // Category labels with translations
  const categoryLabels: Record<string, string> = useMemo(() => {
    const labels: Record<string, string> = {
      "All": t("collections.all"),
      "Rings": t("nav.rings"),
      "Necklaces": t("nav.necklaces"),
      "Bracelets": t("nav.bracelets"),
      "Earrings": t("nav.earrings"),
    };
    // Add Arabic names from API categories
    apiCategories.forEach((c) => {
      if (c.nameAr && language === "ar") {
        labels[c.name] = c.nameAr;
      }
    });
    return labels;
  }, [t, apiCategories, language]);

  const sortOptions = [
    { value: "featured", label: t("sort.featured") },
    { value: "price-asc", label: t("sort.priceAsc") },
    { value: "price-desc", label: t("sort.priceDesc") },
    { value: "newest", label: t("sort.newest") },
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.reverse();
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  // Sync category from URL on load
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory && urlCategory !== selectedCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="luxury-container text-center">
          <p className="luxury-subheading mb-4">{t("collections.subtitle")}</p>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">{t("collections.title")}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("collections.description")}
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-16">
        <div className="luxury-container">
          {/* Filters */}
          <div className={cn(
            "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12",
            isRTL && "md:flex-row-reverse"
          )}>
            <div className={cn(
              "flex flex-wrap gap-2",
              isRTL && "flex-row-reverse"
            )}>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "luxury" : "luxury-outline"
                  }
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                >
                  {categoryLabels[category] || category}
                </Button>
              ))}
            </div>
            <div className={cn(
              "flex items-center gap-4",
              isRTL && "flex-row-reverse"
            )}>
              <span className="text-sm text-muted-foreground">
                {isLoading ? "..." : filteredProducts.length} {t("collections.pieces")}
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className={cn(
                  "w-48 border-foreground/20 bg-background",
                  isRTL && "text-right"
                )}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  {sortOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="hover:bg-hover-muted cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && <ProductGridSkeleton count={8} />}

          {/* Error State */}
          {error && !isLoading && (
            <div className="text-center py-24">
              <h3 className="font-serif text-2xl mb-4 text-destructive">{t("common.error")}</h3>
              <p className="text-muted-foreground mb-8">{error}</p>
              <Button variant="luxury-outline" onClick={refetch}>
                {t("common.tryAgain")}
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-24">
              <h3 className="font-serif text-2xl mb-4">{t("collections.noResults")}</h3>
              <p className="text-muted-foreground mb-8">
                {t("collections.noResultsDesc")}
              </p>
              <Button
                variant="luxury-outline"
                onClick={() => handleCategoryChange("All")}
              >
                {t("featured.viewAll")}
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
