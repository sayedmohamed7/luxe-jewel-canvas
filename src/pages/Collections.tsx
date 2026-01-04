import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");

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
          <p className="luxury-subheading mb-4">Explore</p>
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Collections</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Discover our curated selection of exceptional jewelry, each piece a
            testament to timeless elegance.
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-16">
        <div className="luxury-container">
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "luxury" : "luxury-outline"
                  }
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {filteredProducts.length} pieces
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-foreground/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
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
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <h3 className="font-serif text-2xl mb-4">No pieces found</h3>
              <p className="text-muted-foreground mb-8">
                Try adjusting your filters to discover more.
              </p>
              <Button
                variant="luxury-outline"
                onClick={() => handleCategoryChange("All")}
              >
                View All Collections
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
