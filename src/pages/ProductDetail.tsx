import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === id);
  const inWishlist = product ? isInWishlist(product.id) : false;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 pb-24 text-center">
          <div className="luxury-container">
            <h1 className="font-serif text-4xl mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The piece you're looking for doesn't exist.
            </p>
            <Button asChild variant="luxury">
              <Link to="/collections">Back to Collections</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast({
      title: "Added to bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
  };

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="luxury-container py-6">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              to="/collections"
              className="hover:text-foreground transition-colors"
            >
              Collections
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Detail */}
        <section className="luxury-container pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] bg-champagne overflow-hidden sticky top-28">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover image-reveal"
                />
              </div>
            </div>

            {/* Details */}
            <div className="lg:py-8">
              <p className="luxury-subheading mb-3">{product.category}</p>
              <h1 className="font-serif text-4xl md:text-5xl mb-6">
                {product.name}
              </h1>
              <p className="text-2xl text-primary mb-8">
                {formatPrice(product.price)}
              </p>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Details List */}
              <div className="border-y border-border py-6 mb-8">
                <h3 className="text-xs tracking-widest uppercase mb-4">
                  Details
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      • {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity & Actions */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="text-sm">Quantity</span>
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-secondary transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-secondary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="luxury"
                    size="xl"
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    Add to Bag
                  </Button>
                  <Button
                    variant="luxury-outline"
                    size="xl"
                    onClick={handleWishlistClick}
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5",
                        inWishlist && "fill-primary text-primary"
                      )}
                    />
                  </Button>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Complimentary delivery across the UAE</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Lifetime warranty included</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <RotateCcw className="h-4 w-4" />
                  <span>30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-24 bg-secondary">
            <div className="luxury-container">
              <div className="text-center mb-16">
                <p className="luxury-subheading mb-4">You May Also Like</p>
                <h2 className="font-serif text-3xl md:text-4xl">
                  Related Pieces
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProducts.slice(0, 3).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
