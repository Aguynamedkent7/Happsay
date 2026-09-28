import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 text-[15px] " +
    "transition-colors disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary font-bold text-on-primary hover:bg-primary-hover",
        secondary: "border border-input-border bg-surface font-semibold text-fg-2 hover:bg-bg",
        "ghost-danger": "bg-transparent px-4 font-bold text-danger hover:bg-danger/10",
      },
      size: {
        md: "h-11",
        lg: "h-[52px] text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** Optional leading lucide icon. */
    icon?: React.ReactNode;
  };

export function Button({ className, variant, size, icon, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
