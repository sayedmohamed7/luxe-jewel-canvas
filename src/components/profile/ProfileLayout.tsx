import React from "react";
import { User, Package, Heart, MapPin, Star, Settings, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const profileTabs = [
  { id: "profile", label: "Profile", labelAr: "الملف الشخصي", icon: User, path: "/profile" },
  { id: "orders", label: "Orders", labelAr: "الطلبات", icon: Package, path: "/orders" },
  { id: "wishlist", label: "Wishlist", labelAr: "المفضلة", icon: Heart, path: "/wishlist" },
  { id: "addresses", label: "Addresses", labelAr: "العناوين", icon: MapPin, path: "/profile/addresses" },
  { id: "reviews", label: "Reviews", labelAr: "التقييمات", icon: Star, path: "/profile/reviews" },
  { id: "settings", label: "Settings", labelAr: "الإعدادات", icon: Settings, path: "/profile/settings" },
];

export function ProfileLayout({ children }: ProfileLayoutProps) {
  const { direction, language } = useLanguage();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTab = profileTabs.find((tab) => location.pathname === tab.path)?.id || "profile";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background border-b">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
              <span className="text-2xl md:text-3xl font-semibold text-primary">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-serif font-semibold">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email || "Welcome"}
              </h1>
              <p className="text-muted-foreground mt-1">{user?.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-sm text-muted-foreground">
                  {language === "ar" ? "عضو منذ" : "Member since"}{" "}
                  {new Date().toLocaleDateString(language === "ar" ? "ar-AE" : "en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              {language === "ar" ? "تسجيل الخروج" : "Logout"}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <Tabs value={currentTab} className="w-max min-w-full">
              <TabsList className="h-14 bg-transparent gap-1 p-0">
                {profileTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = currentTab === tab.id;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      asChild
                      className={cn(
                        "h-14 px-4 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                        isActive && "border-primary"
                      )}
                    >
                      <Link to={tab.path} className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {language === "ar" ? tab.labelAr : tab.label}
                        </span>
                      </Link>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-6 md:py-8">{children}</div>

      {/* Mobile Logout */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          {language === "ar" ? "تسجيل الخروج" : "Logout"}
        </Button>
      </div>
    </div>
  );
}
