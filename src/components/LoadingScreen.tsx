import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingScreen({ message, fullScreen = true, className }: LoadingScreenProps) {
  const { t } = useLanguage();
  
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-background",
        fullScreen ? "fixed inset-0 z-50" : "py-24",
        className
      )}
    >
      <div className="text-center">
        <Logo 
          size="lg" 
          className="mx-auto mb-6 animate-logo-shimmer" 
          animated 
          shimmer 
        />
        <p className="text-muted-foreground text-sm tracking-widest uppercase">
          {message || t("common.loading")}
        </p>
      </div>
    </div>
  );
}
