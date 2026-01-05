import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  animated?: boolean;
  shimmer?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, animated = true, shimmer = false, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
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
        shimmer && "animate-logo-shimmer",
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
