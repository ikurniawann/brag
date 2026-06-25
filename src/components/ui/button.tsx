import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-brand-600 text-white shadow-lift hover:bg-brand-700",
        variant === "secondary" &&
          "border border-brand-100 bg-white text-brand-700 hover:bg-brand-50",
        variant === "ghost" && "text-ink hover:bg-brand-50",
        variant === "danger" &&
          "bg-brand-50 text-brand-700 hover:bg-brand-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
