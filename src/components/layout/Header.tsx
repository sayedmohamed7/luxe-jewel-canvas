import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, Menu, Globe, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const currencies = [
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", nameAr: "درهم إماراتي" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", nameAr: "ريال سعودي" },
  { code: "USD", symbol: "$", name: "US Dollar", nameAr: "دولار أمريكي" },
];

const languages = [
  { code: "en" as const, name: "English", nameAr: "الإنجليزية" },
  { code: "ar" as const, name: "العربية", nameAr: "العربية" },
];

export function Header() {
  const { cartCount, wishlist } = useCart();
  const { language, direction, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [currency, setCurrency] = useState(currencies[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === "/";
  const isRTL = direction === "rtl";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.collections"), href: "/collections" },
    { name: t("nav.rings"), href: "/collections?category=Rings" },
    { name: t("nav.necklaces"), href: "/collections?category=Necklaces" },
    { name: t("nav.ourStory"), href: "/about" },
  ];

  const showSolidBg = isScrolled || !isHome;
  const textColor = showSolidBg ? "" : "text-ivory";
  const hoverBg = showSolidBg 
    ? "hover:bg-hover-muted hover:text-primary" 
    : "hover:bg-ivory/10";

  const handleLanguageChange = (langCode: "en" | "ar") => {
    setLanguage(langCode);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        showSolidBg
          ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-gradient-to-b from-noir/40 to-transparent"
      )}
    >
      <div className="luxury-container">
        <div className={cn(
          "flex items-center justify-between h-20",
          isRTL && "flex-row-reverse"
        )}>
          {/* Left: Currency & Language */}
          <div className={cn(
            "hidden md:flex items-center gap-4",
            isRTL && "flex-row-reverse"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-xs tracking-wide transition-colors duration-300",
                    textColor,
                    hoverBg
                  )}
                >
                  {currency.code}
                  <ChevronDown className={cn("h-3 w-3", isRTL ? "mr-1" : "ml-1")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={isRTL ? "end" : "start"} 
                className="min-w-[140px] bg-background border-border"
              >
                {currencies.map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onClick={() => setCurrency(c)}
                    className="text-xs tracking-wide cursor-pointer hover:bg-hover-muted hover:text-primary transition-colors duration-200"
                  >
                    {c.code} - {language === "ar" ? c.nameAr : c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "text-xs tracking-wide transition-colors duration-300",
                    textColor,
                    hoverBg
                  )}
                >
                  <Globe className={cn("h-3.5 w-3.5", isRTL ? "ml-1" : "mr-1")} />
                  {language.toUpperCase()}
                  <ChevronDown className={cn("h-3 w-3", isRTL ? "mr-1" : "ml-1")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align={isRTL ? "end" : "start"} 
                className="bg-background border-border"
              >
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    className="text-xs tracking-wide cursor-pointer hover:bg-hover-muted hover:text-primary transition-colors duration-200"
                  >
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: Logo */}
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 transition-colors duration-300",
              textColor,
              isRTL && "flex-row-reverse"
            )}
          >
            <Logo 
              size="sm" 
              className={textColor} 
              animated={!isScrolled}
              shimmer={!showSolidBg && isHome}
            />
            <span className="font-serif text-lg md:text-xl tracking-wider">
              LE BIJOU
            </span>
          </Link>

          {/* Right: Nav & Icons */}
          <div className={cn(
            "flex items-center gap-6",
            isRTL && "flex-row-reverse"
          )}>
            <nav className={cn(
              "hidden lg:flex items-center gap-8",
              isRTL && "flex-row-reverse"
            )}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-xs tracking-widest uppercase luxury-link transition-colors duration-300",
                    showSolidBg
                      ? "text-muted-foreground hover:text-primary"
                      : "text-ivory/90 hover:text-ivory"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className={cn(
              "flex items-center gap-3",
              isRTL && "flex-row-reverse"
            )}>
              <Link to="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative transition-colors duration-300",
                    textColor,
                    hoverBg
                  )}
                >
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <span className={cn(
                      "absolute -top-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center",
                      isRTL ? "-left-1" : "-right-1"
                    )}>
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              </Link>

              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "relative transition-colors duration-300",
                    textColor,
                    hoverBg
                  )}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className={cn(
                      "absolute -top-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center",
                      isRTL ? "-left-1" : "-right-1"
                    )}>
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "lg:hidden transition-colors duration-300",
                      textColor,
                      hoverBg
                    )}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side={isRTL ? "left" : "right"} 
                  className="w-80 bg-background"
                >
                  <div className="flex flex-col gap-8 pt-8">
                    <div className={cn(
                      "flex items-center gap-2",
                      isRTL && "flex-row-reverse"
                    )}>
                      <Logo size="sm" className="text-primary" />
                      <span className="font-serif text-lg tracking-wider">LE BIJOU</span>
                    </div>
                    
                    <nav className="flex flex-col gap-6">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "text-sm tracking-widest uppercase text-foreground hover:text-primary transition-colors duration-200",
                            isRTL && "text-right"
                          )}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="border-t border-border pt-6">
                      <p className={cn(
                        "text-xs tracking-wider text-muted-foreground mb-3",
                        isRTL && "text-right"
                      )}>
                        {t("nav.currency")}
                      </p>
                      <div className={cn(
                        "flex gap-2 flex-wrap",
                        isRTL && "flex-row-reverse"
                      )}>
                        {currencies.map((c) => (
                          <Button
                            key={c.code}
                            variant={
                              currency.code === c.code
                                ? "default"
                                : "luxury-outline"
                            }
                            size="sm"
                            onClick={() => setCurrency(c)}
                          >
                            {c.code}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className={cn(
                        "text-xs tracking-wider text-muted-foreground mb-3",
                        isRTL && "text-right"
                      )}>
                        {t("nav.language")}
                      </p>
                      <div className={cn(
                        "flex gap-2",
                        isRTL && "flex-row-reverse"
                      )}>
                        {languages.map((l) => (
                          <Button
                            key={l.code}
                            variant={
                              language === l.code
                                ? "default"
                                : "luxury-outline"
                            }
                            size="sm"
                            onClick={() => handleLanguageChange(l.code)}
                          >
                            {l.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
