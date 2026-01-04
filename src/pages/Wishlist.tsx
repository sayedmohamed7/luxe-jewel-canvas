import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { X, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: (typeof wishlist)[0]) => {
    addToCart(item);
    toast({
      title: "Added to bag",
      description: `${item.name} has been added to your shopping bag.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-24">
        <div className="luxury-container">
          <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center">
            Wishlist
          </h1>

          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-8">
                Your wishlist is empty
              </p>
              <Button asChild variant="luxury">
                <Link to="/collections">Explore Collections</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wishlist.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative aspect-[3/4] bg-champagne mb-4 overflow-hidden">
                    <Link to={`/product/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-center">
                    <Link
                      to={`/product/${item.id}`}
                      className="font-serif text-lg hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                      {formatPrice(item.price)}
                    </p>
                    <Button
                      variant="luxury-outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Add to Bag
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
