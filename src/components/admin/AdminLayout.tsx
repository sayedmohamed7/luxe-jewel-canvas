import { ReactNode, useState } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  titleAr?: string;
}

const languages = [
  { code: "en" as const, name: "English" },
  { code: "ar" as const, name: "العربية" },
];

export function AdminLayout({ children, title, titleAr }: AdminLayoutProps) {
  const { language, direction, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRTL = direction === "rtl";

  const displayTitle = isRTL && titleAr ? titleAr : title;

  return (
    <div className={cn("min-h-screen bg-secondary/30", isRTL ? "pr-0 md:pr-64" : "pl-0 md:pl-64")}>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile Header */}
      <header className={cn(
        "md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background border-b border-border flex items-center px-4",
        isRTL && "flex-row-reverse"
      )}>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={isRTL ? "right" : "left"} className="w-64 p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>

        <div className={cn("flex-1 flex items-center gap-2", isRTL ? "justify-end mr-3" : "ml-3")}>
          <Logo size="sm" className="text-primary" />
          <span className="font-serif tracking-wider">LE BIJOU</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen pt-14 md:pt-0">
        {/* Top Bar */}
        <div className={cn(
          "h-16 bg-background border-b border-border px-6 flex items-center justify-between sticky top-14 md:top-0 z-30",
          isRTL && "flex-row-reverse"
        )}>
          <h1 className="font-serif text-xl md:text-2xl">{displayTitle}</h1>

          <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Globe className={cn("h-3.5 w-3.5", isRTL ? "ml-1" : "mr-1")} />
                  {language.toUpperCase()}
                  <ChevronDown className={cn("h-3 w-3", isRTL ? "mr-1" : "ml-1")} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"} className="bg-background border-border">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    className="text-xs cursor-pointer hover:bg-hover-muted"
                  >
                    {l.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Info */}
            <div className={cn("text-right", isRTL && "text-left")}>
              <p className="text-sm font-medium">{user?.firstName || user?.email?.split("@")[0]}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
