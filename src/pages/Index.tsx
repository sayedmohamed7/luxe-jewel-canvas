import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { ArrowRight, Truck, Shield, RefreshCw } from "lucide-react";

import heroImage from "@/assets/hero-jewelry.jpg";
import lifestyleImage from "@/assets/collection-lifestyle.jpg";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury diamond necklace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-noir/40" />
        </div>
        <div className="relative z-10 text-center text-ivory px-6 max-w-4xl mx-auto">
          <p
            className="luxury-subheading text-ivory/80 mb-6 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            The New Collection
          </p>
          <h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal mb-8 leading-tight animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            Eternal
            <br />
            <span className="italic">Radiance</span>
          </h1>
          <p
            className="text-ivory/70 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            Discover our latest collection, where timeless elegance meets
            contemporary design.
          </p>
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/collections">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-ivory/30" />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 md:py-32">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <p className="luxury-subheading mb-4">Curated Selection</p>
            <h2 className="font-serif text-4xl md:text-5xl">
              Bestselling Pieces
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
          <div className="text-center mt-16">
            <Button asChild variant="luxury-outline" size="lg">
              <Link to="/collections">View All Collections</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Collection Banner */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img
          src={lifestyleImage}
          alt="Woman wearing luxury jewelry"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/70 via-noir/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="luxury-container">
            <div className="max-w-lg">
              <p className="luxury-subheading text-ivory/80 mb-4">
                Signature Collection
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-ivory mb-6">
                The Art of
                <br />
                <span className="italic">Wearing Gold</span>
              </h2>
              <p className="text-ivory/70 mb-8">
                Each piece is a testament to the enduring allure of gold,
                meticulously crafted by master artisans.
              </p>
              <Button asChild variant="hero" size="lg">
                <Link to="/collections">Discover More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 md:py-32">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <p className="luxury-subheading mb-4">Browse By</p>
            <h2 className="font-serif text-4xl md:text-5xl">Categories</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {["Rings", "Necklaces", "Bracelets", "Earrings"].map((category) => (
              <Link
                key={category}
                to={`/collections?category=${category}`}
                className="group relative aspect-[4/5] overflow-hidden bg-champagne"
              >
                <img
                  src={
                    products.find((p) => p.category === category)?.image ||
                    products[0].image
                  }
                  alt={category}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-noir/30 group-hover:bg-noir/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-serif text-2xl text-ivory">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-24 md:py-32 bg-secondary">
        <div className="luxury-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <p className="luxury-subheading mb-4">Our Heritage</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                Crafted with
                <br />
                <span className="italic">Passion</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                For over three decades, Maison Lumière has been creating
                exceptional jewelry that transcends time. Our master artisans
                combine centuries-old techniques with contemporary design to
                craft pieces that become cherished heirlooms.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every gemstone is hand-selected, every setting precision-crafted,
                and every piece finished to perfection.
              </p>
              <Button asChild variant="luxury" size="lg">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <img
                  src={craftsmanshipImage}
                  alt="Artisan crafting jewelry"
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 border-y border-border">
        <div className="luxury-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <Truck className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-serif text-lg mb-2">
                Complimentary Delivery
              </h4>
              <p className="text-sm text-muted-foreground">
                Free shipping across the UAE on all orders
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-serif text-lg mb-2">Lifetime Warranty</h4>
              <p className="text-sm text-muted-foreground">
                Every piece is backed by our quality guarantee
              </p>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-serif text-lg mb-2">30-Day Returns</h4>
              <p className="text-sm text-muted-foreground">
                Hassle-free returns within 30 days of purchase
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
