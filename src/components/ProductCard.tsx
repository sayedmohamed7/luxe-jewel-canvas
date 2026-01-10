import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProductQuickView } from "@/components/ProductQuickView";
import { useToast } from "@/hooks/use-toast";

// Flexible product interface to support both local and API products
export interface ProductCardData {
  id: string;
  name: string;
  nameAr?: string;
  price: number;
  priceUSD?: number;
  category: string;
  categoryAr?: string;
  image: string;
  images?: string[];
  description?: string;
}

interface ProductCardProps {
  product: ProductCardData;
  className?: string;
  style?: React.CSSProperties;
  index?: number;
}

export function ProductCard({ product, className, style, index = 0 }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { t, direction, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const [showQuickView, setShowQuickView] = useState(false);
  const inWishlist = isInWishlist(product.id);
  const isRTL = direction === "rtl";

  const displayName = language === "ar" && product.nameAr ? product.nameAr : product.name;
  const displayCategory = language === "ar" && product.categoryAr ? product.categoryAr : product.category;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        productId: product.id,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        priceUSD: product.priceUSD,
        image: product.image,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      productId: product.id,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      priceUSD: product.priceUSD,
      image: product.image,
    });
    toast({
      title: t("product.addedToBag"),
      description: `${displayName} ${t("product.addedToBagDesc")}`,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <Link
        to={`/product/${product.id}`}
        className={cn(
          "group block product-card-enter",
          className
        )}
        style={{ 
          ...style,
          animationDelay: `${index * 0.08}s`
        }}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-champagne mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className={cn(
              "absolute top-4 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background",
              isRTL ? "left-4" : "right-4"
            )}
            aria-label={inWishlist ? t("product.inWishlist") : t("product.addToWishlist")}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                inWishlist ? "fill-primary text-primary" : "text-foreground"
              )}
            />
          </button>

          {/* Overlay Gradient */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-noir/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Action Buttons - Desktop hover */}
          <div className={cn(
            "absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 md:flex hidden",
            isRTL && "flex-row-reverse"
          )}>
            <Button
              variant="luxury-gold"
              size="sm"
              className={cn("flex-1 text-xs", isRTL && "flex-row-reverse")}
              onClick={handleAddToCart}
            >
              <ShoppingBag className={cn("h-3.5 w-3.5", isRTL ? "ml-1.5" : "mr-1.5")} />
              {t("product.addToBag")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={handleQuickView}
              aria-label={t("product.quickView")}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Mobile Actions - Always visible but minimal */}
          <div className={cn(
            "absolute bottom-4 flex gap-2 md:hidden",
            isRTL ? "left-4" : "right-4"
          )}>
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
              aria-label={t("product.addToBag")}
            >
              <ShoppingBag className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={handleQuickView}
              className="p-2.5 bg-background/90 backdrop-blur-sm hover:bg-background transition-colors"
              aria-label={t("product.quickView")}
            >
              <Eye className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
        
        <div className={cn("text-center", isRTL && "text-center")}>
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
            {displayCategory}
          </p>
          <h3 className="font-serif text-lg mb-2 group-hover:text-primary transition-colors duration-300">
            {displayName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      <ProductQuickView
        product={{
          ...product,
          images: product.images || [product.image],
          description: product.description || "",
        }}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
}
