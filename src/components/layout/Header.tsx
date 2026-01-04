import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, Menu, Globe, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const currencies = [
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "USD", symbol: "$", name: "US Dollar" },
];

const languages = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
];

export function Header() {
  const { cartCount, wishlist } = useCart();
  const location = useLocation();
  const [currency, setCurrency] = useState(currencies[0]);
  const [language, setLanguage] = useState(languages[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === "/";

  // Track scroll position to adapt header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Collections", href: "/collections" },
    { name: "Rings", href: "/collections?category=Rings" },
    { name: "Necklaces", href: "/collections?category=Necklaces" },
    { name: "Our Story", href: "/about" },
  ];

  // Dynamic styling based on scroll and page
  const showSolidBg = isScrolled || !isHome;
  const textColor = showSolidBg ? "" : "text-ivory";
  const hoverBg = showSolidBg ? "" : "hover:bg-ivory/10";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showSolidBg
          ? "bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
          : "bg-gradient-to-b from-noir/40 to-transparent"
      }`}
    >
      <div className="luxury-container">
        <div className="flex items-center justify-between h-20">
          {/* Left: Currency & Language */}
          <div className="hidden md:flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs tracking-wide ${textColor} ${hoverBg}`}
                >
                  {currency.code}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[140px] bg-background">
                {currencies.map((c) => (
                  <DropdownMenuItem
                    key={c.code}
                    onClick={() => setCurrency(c)}
                    className="text-xs tracking-wide"
                  >
                    {c.code} - {c.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs tracking-wide ${textColor} ${hoverBg}`}
                >
                  <Globe className="h-3.5 w-3.5 mr-1" />
                  {language.code.toUpperCase()}
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-background">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLanguage(l)}
                    className="text-xs tracking-wide"
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
            className={`flex items-center gap-3 ${textColor}`}
          >
            <Logo size="sm" className={textColor} animated={!isScrolled} />
            <span className="font-serif text-xl md:text-2xl tracking-wider">
              LE BIJOU
            </span>
          </Link>

          {/* Right: Nav & Icons */}
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-xs tracking-widest uppercase luxury-link ${
                    showSolidBg
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-ivory/90 hover:text-ivory"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link to="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative ${textColor} ${hoverBg}`}
                >
                  <Heart className="h-5 w-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              </Link>

              <Link to="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative ${textColor} ${hoverBg}`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
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
                    className={`lg:hidden ${textColor} ${hoverBg}`}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-background">
                  <div className="flex flex-col gap-8 pt-8">
                    <div className="flex items-center gap-2">
                      <Logo size="sm" className="text-primary" />
                      <span className="font-serif text-lg tracking-wider">LE BIJOU</span>
                    </div>
                    
                    <nav className="flex flex-col gap-6">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          to={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm tracking-widest uppercase text-foreground hover:text-primary transition-colors"
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="border-t border-border pt-6">
                      <p className="text-xs tracking-wider text-muted-foreground mb-3">
                        Currency
                      </p>
                      <div className="flex gap-2">
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
                      <p className="text-xs tracking-wider text-muted-foreground mb-3">
                        Language
                      </p>
                      <div className="flex gap-2">
                        {languages.map((l) => (
                          <Button
                            key={l.code}
                            variant={
                              language.code === l.code
                                ? "default"
                                : "luxury-outline"
                            }
                            size="sm"
                            onClick={() => setLanguage(l)}
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
