import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";
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
  const { t, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");

  const sortOptions = [
    { value: "featured", label: t("sort.featured") },
    { value: "price-asc", label: t("sort.priceAsc") },
    { value: "price-desc", label: t("sort.priceDesc") },
    { value: "newest", label: t("sort.newest") },
  ];

  const categoryLabels: Record<string, string> = {
    "All": t("collections.all"),
    "Rings": t("nav.rings"),
    "Necklaces": t("nav.necklaces"),
    "Bracelets": t("nav.bracelets"),
    "Earrings": t("nav.earrings"),
  };

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
  }, [selectedCategory, sortBy]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

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
                {filteredProducts.length} {t("collections.pieces")}
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

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          ) : (
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
