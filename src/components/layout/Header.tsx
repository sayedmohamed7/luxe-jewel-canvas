import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, ShoppingBag, Menu, Globe, ChevronDown, User, LogOut, Package, Settings } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency, currencies } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en" as const, name: "English", nameAr: "الإنجليزية" },
  { code: "ar" as const, name: "العربية", nameAr: "العربية" },
];

export function Header() {
  const { cartCount, wishlist } = useCart();
  const { language, direction, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === "/";
  const isRTL = direction === "rtl";
  const isAdmin = user?.role === "Admin";

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
              {/* Auth: Login/Register or Profile */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "relative transition-colors duration-300",
                        textColor,
                        hoverBg
                      )}
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align={isRTL ? "start" : "end"} 
                    className="min-w-[180px] bg-background border-border"
                  >
                    <div className={cn("px-3 py-2 border-b border-border", isRTL && "text-right")}>
                      <p className="text-sm font-medium">
                        {user?.firstName || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/profile" 
                        className={cn(
                          "flex items-center gap-2 cursor-pointer hover:bg-hover-muted hover:text-primary",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <User className="h-4 w-4" />
                        {t("profile.personalInfo")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/orders" 
                        className={cn(
                          "flex items-center gap-2 cursor-pointer hover:bg-hover-muted hover:text-primary",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <Package className="h-4 w-4" />
                        {t("profile.myOrders")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/wishlist" 
                        className={cn(
                          "flex items-center gap-2 cursor-pointer hover:bg-hover-muted hover:text-primary",
                          isRTL && "flex-row-reverse"
                        )}
                      >
                        <Heart className="h-4 w-4" />
                        {t("profile.wishlist")}
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link 
                            to="/admin" 
                            className={cn(
                              "flex items-center gap-2 cursor-pointer hover:bg-hover-muted hover:text-primary",
                              isRTL && "flex-row-reverse"
                            )}
                          >
                            <Settings className="h-4 w-4" />
                            {t("nav.adminDashboard")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer text-destructive hover:bg-destructive/10",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      <LogOut className="h-4 w-4" />
                      {t("auth.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className={cn("hidden md:flex items-center gap-2", isRTL && "flex-row-reverse")}>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-xs tracking-wide transition-colors duration-300",
                        textColor,
                        hoverBg
                      )}
                    >
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant={showSolidBg ? "luxury-outline" : "outline"}
                      size="sm"
                      className={cn(
                        "text-xs tracking-wide",
                        !showSolidBg && "border-ivory/50 text-ivory hover:bg-ivory/10"
                      )}
                    >
                      {t("nav.register")}
                    </Button>
                  </Link>
                </div>
              )}

              {isAuthenticated && (
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
              )}

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
                    
                    {/* Mobile Auth */}
                    {isAuthenticated ? (
                      <div className={cn("pb-6 border-b border-border", isRTL && "text-right")}>
                        <p className="text-sm font-medium">
                          {user?.firstName || user?.email?.split("@")[0]}
                        </p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    ) : (
                      <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                          <Button variant="luxury-outline" className="w-full">
                            {t("nav.login")}
                          </Button>
                        </Link>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                          <Button variant="luxury" className="w-full">
                            {t("nav.register")}
                          </Button>
                        </Link>
                      </div>
                    )}
                    
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
                      
                      {isAuthenticated && (
                        <>
                          <Link
                            to="/profile"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "text-sm tracking-widest uppercase text-foreground hover:text-primary transition-colors duration-200",
                              isRTL && "text-right"
                            )}
                          >
                            {t("profile.personalInfo")}
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "text-sm tracking-widest uppercase text-foreground hover:text-primary transition-colors duration-200",
                              isRTL && "text-right"
                            )}
                          >
                            {t("profile.myOrders")}
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                "text-sm tracking-widest uppercase text-primary hover:text-primary/80 transition-colors duration-200",
                                isRTL && "text-right"
                              )}
                            >
                              {t("nav.adminDashboard")}
                            </Link>
                          )}
                        </>
                      )}
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

                    {isAuthenticated && (
                      <div className="pt-4 border-t border-border">
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
                            isRTL && "flex-row-reverse"
                          )}
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                          {t("auth.logout")}
                        </Button>
                      </div>
                    )}
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
