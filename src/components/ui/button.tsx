import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-hover-gold hover:shadow-gold rounded-sm",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 rounded-sm",
        outline:
          "border border-foreground/20 bg-transparent text-foreground hover:bg-foreground hover:text-background rounded-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-hover-muted rounded-sm",
        ghost: "text-foreground hover:bg-hover-muted hover:text-primary rounded-sm",
        link: "text-foreground underline-offset-4 hover:underline hover:text-primary",
        luxury:
          "bg-noir text-ivory border border-noir hover:bg-transparent hover:text-noir tracking-widest uppercase text-xs rounded-none transition-all duration-500",
        "luxury-outline":
          "bg-transparent border border-foreground/30 text-foreground hover:border-primary hover:text-primary tracking-widest uppercase text-xs rounded-none transition-all duration-500",
        "luxury-gold":
          "bg-primary text-primary-foreground hover:bg-hover-gold tracking-widest uppercase text-xs shadow-gold hover:shadow-elevated rounded-none transition-all duration-500",
        hero:
          "bg-ivory/10 backdrop-blur-sm text-ivory border border-ivory/30 hover:bg-ivory/20 hover:border-ivory/50 tracking-widest uppercase text-xs rounded-none transition-all duration-500",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-10 py-3",
        xl: "h-14 px-12 py-4 text-sm",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
