import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-noir text-ivory">
      {/* Newsletter Section */}
      <div className="border-b border-ivory/10">
        <div className="luxury-container py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl mb-4">
              Join Our World
            </h3>
            <p className="text-ivory/60 text-sm mb-8">
              Be the first to discover new collections, exclusive events, and
              stories of exceptional craftsmanship.
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-transparent border-ivory/30 text-ivory placeholder:text-ivory/40 focus:border-primary"
              />
              <Button variant="luxury-gold" size="lg">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="luxury-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-serif text-2xl tracking-wider">
              MAISON LUMIÈRE
            </Link>
            <p className="text-ivory/50 text-sm mt-4 leading-relaxed">
              Crafting timeless elegance since 1987. Each piece tells a story of
              exceptional artistry and enduring beauty.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="text-ivory/50 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-ivory/50 hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-ivory/50 hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6">
              Collections
            </h4>
            <ul className="space-y-3">
              {["Rings", "Necklaces", "Bracelets", "Earrings", "New Arrivals"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/collections"
                      className="text-ivory/60 text-sm hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6">
              Customer Care
            </h4>
            <ul className="space-y-3">
              {[
                "Contact Us",
                "Shipping & Delivery",
                "Returns & Exchanges",
                "Size Guide",
                "FAQs",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/contact"
                    className="text-ivory/60 text-sm hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6">
              About
            </h4>
            <ul className="space-y-3">
              {[
                "Our Story",
                "Craftsmanship",
                "Sustainability",
                "Press",
                "Careers",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/about"
                    className="text-ivory/60 text-sm hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-ivory/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ivory/40 text-xs">
            © 2024 Maison Lumière. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to="#"
              className="text-ivory/40 text-xs hover:text-ivory/60 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-ivory/40 text-xs hover:text-ivory/60 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-ivory/40 text-xs hover:text-ivory/60 transition-colors"
            >
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
