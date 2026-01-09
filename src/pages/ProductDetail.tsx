import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Minus, Plus, Truck, Shield, RotateCcw, Star, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
        productId: product.id,
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
        productId: product.id,
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

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

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
        <section className="luxury-container pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="relative">
              {/* Main Image */}
              <div 
                className="aspect-[3/4] bg-champagne overflow-hidden cursor-zoom-in relative group"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover image-reveal transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "w-20 h-24 bg-champagne overflow-hidden transition-all duration-300",
                        selectedImageIndex === index 
                          ? "ring-2 ring-primary" 
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:py-8">
              <p className="luxury-subheading mb-3">{product.category}</p>
              <h1 className="font-serif text-4xl md:text-5xl mb-4">
                {product.name}
              </h1>
              
              {/* Rating Summary */}
              {product.reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-4 w-4",
                          star <= averageRating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

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

        {/* Product Tabs */}
        <section className="luxury-container pb-24">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-8">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-4 px-0 text-sm tracking-wider uppercase"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-4 px-0 text-sm tracking-wider uppercase"
              >
                Reviews ({product.reviews.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="pt-8">
              <div className="max-w-3xl">
                <p className="text-muted-foreground leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-8">
              {product.reviews.length > 0 ? (
                <div className="max-w-3xl space-y-8">
                  {/* Rating Summary */}
                  <div className="flex items-center gap-4 pb-8 border-b border-border">
                    <div className="text-center">
                      <p className="font-serif text-4xl">{averageRating.toFixed(1)}</p>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-4 w-4",
                              star <= averageRating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.reviews.length} {product.reviews.length === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {product.reviews.map((review) => (
                    <div key={review.id} className="pb-8 border-b border-border last:border-0">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{review.author}</p>
                          {review.verified && (
                            <p className="text-xs text-primary">Verified Purchase</p>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "h-4 w-4",
                              star <= review.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}

                  <p className="text-sm text-muted-foreground italic">
                    Only verified purchasers can leave reviews. All reviews are moderated before publication.
                  </p>
                </div>
              ) : (
                <div className="max-w-3xl text-center py-12">
                  <p className="text-muted-foreground mb-2">No reviews yet</p>
                  <p className="text-sm text-muted-foreground">
                    Be the first to review this piece after your purchase.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-noir/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 text-ivory hover:text-primary transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-ivory hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <img
            src={product.images[selectedImageIndex]}
            alt={product.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-ivory hover:text-primary transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Lightbox Thumbnails */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(index); }}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  selectedImageIndex === index ? "bg-primary" : "bg-ivory/40"
                )}
              />
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
