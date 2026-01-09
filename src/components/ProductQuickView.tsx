import { X, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProductQuickViewData {
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

interface ProductQuickViewProps {
  product: ProductQuickViewData;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { t, direction, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);
  const isRTL = direction === "rtl";

  const displayName = language === "ar" && product.nameAr ? product.nameAr : product.name;
  const displayCategory = language === "ar" && product.categoryAr ? product.categoryAr : product.category;

  const handleAddToCart = () => {
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
    onClose();
  };

  const handleWishlistClick = () => {
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-noir/60 backdrop-blur-sm animate-fade-in" />
      
      {/* Modal */}
      <div 
        className="relative bg-background w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 z-10 p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors duration-200",
            isRTL ? "left-4" : "right-4"
          )}
          aria-label={t("common.close")}
        >
          <X className="h-5 w-5" />
        </button>

        <div className={cn(
          "grid md:grid-cols-2",
          isRTL && "md:grid-flow-col-dense"
        )}>
          {/* Image */}
          <div className={cn(
            "aspect-square bg-champagne",
            isRTL && "md:col-start-2"
          )}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className={cn(
            "p-6 md:p-8 flex flex-col justify-center",
            isRTL && "md:col-start-1 text-right"
          )}>
            <p className="luxury-subheading mb-2">{displayCategory}</p>
            <h3 className="font-serif text-2xl md:text-3xl mb-3">{displayName}</h3>
            <p className="text-xl text-primary mb-4">{formatPrice(product.price)}</p>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="space-y-3">
              <Button
                variant="luxury"
                size="lg"
                className={cn("w-full", isRTL && "flex-row-reverse")}
                onClick={handleAddToCart}
              >
                <ShoppingBag className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                {t("product.addToBag")}
              </Button>
              
              <div className={cn(
                "flex gap-3",
                isRTL && "flex-row-reverse"
              )}>
                <Button
                  variant="luxury-outline"
                  size="lg"
                  className={cn("flex-1 min-w-0", isRTL && "flex-row-reverse")}
                  onClick={handleWishlistClick}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isRTL ? "ml-2" : "mr-2",
                      inWishlist && "fill-primary text-primary"
                    )}
                  />
                  <span className="truncate">
                    {inWishlist ? t("product.inWishlist") : t("product.addToWishlist")}
                  </span>
                </Button>
                
                <Button 
                  asChild 
                  variant="luxury-outline" 
                  size="lg" 
                  className="flex-1 min-w-0"
                >
                  <Link to={`/product/${product.id}`} onClick={onClose}>
                    <span className="truncate">{t("product.viewDetails")}</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
