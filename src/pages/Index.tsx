import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, ArrowLeft, Truck, Shield, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

import heroImage from "@/assets/hero-jewelry.jpg";
import lifestyleImage from "@/assets/collection-lifestyle.jpg";
import craftsmanshipImage from "@/assets/craftsmanship.jpg";

const Index = () => {
  const { t, direction } = useLanguage();
  const isRTL = direction === "rtl";
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

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
            {t("hero.subtitle")}
          </p>
          <h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-normal mb-8 leading-tight animate-fade-up"
            style={{ animationDelay: "0.4s" }}
          >
            {t("hero.title1")}
            <br />
            <span className="italic">{t("hero.title2")}</span>
          </h1>
          <p
            className="text-ivory/70 text-lg md:text-xl max-w-xl mx-auto mb-10 font-light animate-fade-up"
            style={{ animationDelay: "0.6s" }}
          >
            {t("hero.description")}
          </p>
          <div
            className="animate-fade-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/collections" className={cn(isRTL && "flex-row-reverse")}>
                {t("hero.cta")}
                <ArrowIcon className={cn("h-4 w-4", isRTL ? "mr-2" : "ml-2")} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-ivory/30" />
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-24 md:py-32 scroll-mt-24">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <p className="luxury-subheading mb-4">{t("featured.subtitle")}</p>
            <h2 className="font-serif text-4xl md:text-5xl">
              {t("featured.title")}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
          <div className="text-center mt-16">
            <Button asChild variant="luxury-outline" size="lg">
              <Link to="/collections">{t("featured.viewAll")}</Link>
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
        <div className={cn(
          "absolute inset-0",
          isRTL 
            ? "bg-gradient-to-l from-noir/70 via-noir/40 to-transparent"
            : "bg-gradient-to-r from-noir/70 via-noir/40 to-transparent"
        )} />
        <div className="absolute inset-0 flex items-center">
          <div className="luxury-container">
            <div className={cn("max-w-lg", isRTL && "mr-auto text-right")}>
              <p className="luxury-subheading text-ivory/80 mb-4">
                {t("collection.subtitle")}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-ivory mb-6">
                {t("collection.title1")}
                <br />
                <span className="italic">{t("collection.title2")}</span>
              </h2>
              <p className="text-ivory/70 mb-8">
                {t("collection.description")}
              </p>
              <Button asChild variant="hero" size="lg">
                <Link to="/collections">{t("collection.cta")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-24 md:py-32 scroll-mt-24">
        <div className="luxury-container">
          <div className="text-center mb-16">
            <p className="luxury-subheading mb-4">{t("categories.subtitle")}</p>
            <h2 className="font-serif text-4xl md:text-5xl">{t("categories.title")}</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: "Rings", label: t("nav.rings") },
              { key: "Necklaces", label: t("nav.necklaces") },
              { key: "Bracelets", label: t("nav.bracelets") },
              { key: "Earrings", label: t("nav.earrings") },
            ].map((category, index) => (
              <Link
                key={category.key}
                to={`/collections?category=${category.key}`}
                className="group relative aspect-[4/5] overflow-hidden bg-champagne product-card-enter"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img
                  src={
                    products.find((p) => p.category === category.key)?.image ||
                    products[0].image
                  }
                  alt={category.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-noir/30 group-hover:bg-noir/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="font-serif text-2xl text-ivory">{category.label}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section id="craftsmanship" className="py-24 md:py-32 bg-secondary scroll-mt-24">
        <div className="luxury-container">
          <div className={cn(
            "grid lg:grid-cols-2 gap-16 items-center",
            isRTL && "lg:grid-flow-col-dense"
          )}>
            <div className={cn(
              "order-2 lg:order-1",
              isRTL && "lg:order-2 text-right"
            )}>
              <p className="luxury-subheading mb-4">{t("craft.subtitle")}</p>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                {t("craft.title1")}
                <br />
                <span className="italic">{t("craft.title2")}</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t("craft.description1")}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {t("craft.description2")}
              </p>
              <Button asChild variant="luxury" size="lg">
                <Link to="/about">{t("craft.cta")}</Link>
              </Button>
            </div>
            <div className={cn(
              "order-1 lg:order-2",
              isRTL && "lg:order-1"
            )}>
              <div className="relative">
                <img
                  src={craftsmanshipImage}
                  alt="Artisan crafting jewelry"
                  className="w-full aspect-square object-cover"
                />
                <div className={cn(
                  "absolute -bottom-6 w-32 h-32 border border-primary",
                  isRTL ? "-right-6" : "-left-6"
                )} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 border-y border-border">
        <div className="luxury-container">
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-10 text-center",
            isRTL && "text-center"
          )}>
            <div className="flex flex-col items-center">
              <Truck className={cn("h-8 w-8 text-primary mb-4", isRTL && "rtl-flip")} />
              <h4 className="font-serif text-lg mb-2">
                {t("trust.delivery.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("trust.delivery.desc")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-serif text-lg mb-2">{t("trust.warranty.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("trust.warranty.desc")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 text-primary mb-4" />
              <h4 className="font-serif text-lg mb-2">{t("trust.returns.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("trust.returns.desc")}
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
