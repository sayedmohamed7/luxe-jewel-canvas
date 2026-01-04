import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, animated = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      strokeWidth="1.2"
      stroke="currentColor"
      className={cn(
        sizeClasses[size],
        animated && "animate-logo-fade-in",
        className
      )}
    >
      <path d="M30 25 L70 25 L95 45 L50 95 L5 45 Z" />
      <path d="M30 25 L5 45 M70 25 L95 45" />
      <path d="M5 45 L50 95 L95 45" />
      <path d="M5 45 L50 25 L95 45" strokeWidth="0.8" opacity="0.8" />
      <path d="M50 95 L50 45" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}
