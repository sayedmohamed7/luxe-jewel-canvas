import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { User, Package, Heart, MapPin, Star, ChevronRight, LogOut } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { t, direction } = useLanguage();
  const isRTL = direction === "rtl";

  const menuItems = [
    {
      icon: User,
      label: t("profile.personalInfo"),
      description: t("profile.personalInfoDesc"),
      href: "/profile/edit",
    },
    {
      icon: Package,
      label: t("profile.myOrders"),
      description: t("profile.myOrdersDesc"),
      href: "/orders",
    },
    {
      icon: Heart,
      label: t("profile.wishlist"),
      description: t("profile.wishlistDesc"),
      href: "/wishlist",
    },
    {
      icon: MapPin,
      label: t("profile.addresses"),
      description: t("profile.addressesDesc"),
      href: "/profile/addresses",
    },
    {
      icon: Star,
      label: t("profile.reviews"),
      description: t("profile.reviewsDesc"),
      href: "/profile/reviews",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-24">
        <div className="luxury-container max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className={cn(
            "flex items-center gap-6 mb-12",
            isRTL && "flex-row-reverse"
          )}>
            <div className="h-20 w-20 rounded-full bg-champagne flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className={cn(isRTL && "text-right")}>
              <h1 className="font-serif text-2xl md:text-3xl">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ""}`
                  : t("profile.welcome")}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">{user?.email}</p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 p-5 border border-border hover:border-primary/30 hover:bg-champagne/30 transition-all duration-300 group",
                  isRTL && "flex-row-reverse"
                )}
              >
                <div className="h-12 w-12 rounded-full bg-champagne/50 flex items-center justify-center group-hover:bg-champagne transition-colors">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={cn("flex-1", isRTL && "text-right")}>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className={cn(
                  "h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors",
                  isRTL && "rotate-180"
                )} />
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <div className="mt-12 pt-8 border-t border-border">
            <Button
              variant="luxury-outline"
              className={cn(
                "w-full h-12 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30",
                isRTL && "flex-row-reverse"
              )}
              onClick={logout}
            >
              <LogOut className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t("auth.logout")}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
