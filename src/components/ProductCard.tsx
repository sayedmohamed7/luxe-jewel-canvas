import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
}

export function ProductCard({ product, className, style }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn("group block", className)}
      style={style}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-champagne mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-background"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              inWishlist ? "fill-primary text-primary" : "text-foreground"
            )}
          />
        </button>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-noir/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="text-center">
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-lg mb-2 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
