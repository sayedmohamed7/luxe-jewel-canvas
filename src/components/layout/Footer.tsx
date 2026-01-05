import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const collections = [
    { name: t("nav.rings"), href: "/collections?category=Rings" },
    { name: t("nav.necklaces"), href: "/collections?category=Necklaces" },
    { name: t("nav.bracelets"), href: "/collections?category=Bracelets" },
    { name: t("nav.earrings"), href: "/collections?category=Earrings" },
  ];

  const customerCare = [
    { name: t("nav.contact"), href: "/contact" },
    { name: t("footer.shipping"), href: "/contact" },
    { name: t("footer.returns"), href: "/contact" },
    { name: t("footer.faq"), href: "/contact" },
  ];

  const aboutLinks = [
    { name: t("nav.ourStory"), href: "/about" },
    { name: t("footer.craftsmanship"), href: "/about" },
    { name: t("footer.sustainability"), href: "/about" },
    { name: t("footer.careers"), href: "/contact" },
  ];

  return (
    <footer className="bg-noir text-ivory">
      {/* Newsletter Section */}
      <div className="border-b border-ivory/10">
        <div className="luxury-container py-16 md:py-20">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="font-serif text-2xl md:text-3xl mb-4">
              {t("footer.newsletter.title")}
            </h3>
            <p className="text-ivory/60 text-sm mb-8">
              {t("footer.newsletter.desc")}
            </p>
            <form className={cn(
              "flex gap-3 max-w-md mx-auto",
              isRTL && "flex-row-reverse"
            )}>
              <Input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                className={cn(
                  "bg-transparent border-ivory/30 text-ivory placeholder:text-ivory/40 focus:border-primary",
                  isRTL && "text-right"
                )}
              />
              <Button variant="luxury-gold" size="lg">
                {t("footer.newsletter.button")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="luxury-container py-16">
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12",
          isRTL && "text-right"
        )}>
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link 
              to="/" 
              className={cn(
                "flex items-center gap-2 mb-4",
                isRTL && "flex-row-reverse justify-end"
              )}
            >
              <Logo size="sm" className="text-ivory" animated={false} />
              <span className="font-serif text-xl tracking-wider">LE BIJOU</span>
            </Link>
            <p className="text-ivory/50 text-sm leading-relaxed">
              {t("craft.description1").slice(0, 120)}...
            </p>
            <div className={cn(
              "flex gap-4 mt-6",
              isRTL && "flex-row-reverse justify-end"
            )}>
              <a
                href="#"
                className="text-ivory/50 hover:text-gold-light transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-ivory/50 hover:text-gold-light transition-colors duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-ivory/50 hover:text-gold-light transition-colors duration-300"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6">
              {t("nav.collections")}
            </h4>
            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-ivory/60 text-sm hover:text-gold-light transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6">
              {t("footer.support")}
            </h4>
            <ul className="space-y-3">
              {customerCare.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-ivory/60 text-sm hover:text-gold-light transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6">
              {t("footer.about")}
            </h4>
            <ul className="space-y-3">
              {aboutLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-ivory/60 text-sm hover:text-gold-light transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn(
          "border-t border-ivory/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4",
          isRTL && "md:flex-row-reverse"
        )}>
          <p className="text-ivory/40 text-xs">
            © 2024 Le Bijou Boutique. {t("footer.rights")}
          </p>
          <div className={cn(
            "flex gap-6",
            isRTL && "flex-row-reverse"
          )}>
            <Link
              to="#"
              className="text-ivory/40 text-xs hover:text-ivory/60 transition-colors duration-300"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="#"
              className="text-ivory/40 text-xs hover:text-ivory/60 transition-colors duration-300"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
