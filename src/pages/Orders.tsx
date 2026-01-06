import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { Package, ChevronRight } from "lucide-react";

export default function Orders() {
  const { t, direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Mock empty orders for now - will be fetched from API
  const orders: never[] = [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-32 pb-24">
        <div className="luxury-container">
          {/* Back Link */}
          <Link
            to="/profile"
            className={cn(
              "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8",
              isRTL && "flex-row-reverse"
            )}
          >
            <ChevronRight className={cn("h-4 w-4", !isRTL && "rotate-180")} />
            {t("common.back")}
          </Link>

          <h1 className={cn(
            "font-serif text-3xl md:text-4xl mb-8",
            isRTL && "text-right"
          )}>
            {t("profile.myOrders")}
          </h1>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="h-20 w-20 mx-auto mb-6 rounded-full bg-champagne flex items-center justify-center">
                <Package className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground mb-8">{t("orders.empty")}</p>
              <Button asChild variant="luxury">
                <Link to="/collections">{t("orders.startShopping")}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Orders would be mapped here */}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
