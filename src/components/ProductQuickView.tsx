import { X, Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
    onClose();
  };

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
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
        className="relative bg-background w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square bg-champagne">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <p className="luxury-subheading mb-2">{product.category}</p>
            <h3 className="font-serif text-2xl md:text-3xl mb-3">{product.name}</h3>
            <p className="text-xl text-primary mb-4">{formatPrice(product.price)}</p>
            
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="space-y-3">
              <Button
                variant="luxury"
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Bag
              </Button>
              
              <div className="flex gap-3">
                <Button
                  variant="luxury-outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleWishlistClick}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4 mr-2",
                      inWishlist && "fill-primary text-primary"
                    )}
                  />
                  {inWishlist ? "In Wishlist" : "Add to Wishlist"}
                </Button>
                
                <Button asChild variant="luxury-outline" size="lg" className="flex-1">
                  <Link to={`/product/${product.id}`} onClick={onClose}>
                    View Details
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
