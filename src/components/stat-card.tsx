import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  className?: string;
  gradient?: string;
};

export function StatCard({
  icon: Icon,
  label,
  value,
  helper,
  className,
  gradient,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4",
        gradient
          ? `border ${gradient}`
          : "glass-panel",
        className
      )}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className={cn("text-sm font-semibold uppercase tracking-[0.1em]", gradient ? "text-current opacity-70" : "text-muted")}>
          {label}
        </p>
        <span className={cn("grid h-10 w-10 place-items-center rounded-full", gradient ? "bg-white/40" : "bg-brand-50 text-brand-600")}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className={cn("text-3xl font-black tracking-normal", gradient ? "text-current" : "text-brand-600")}>{value}</p>
      <p className={cn("mt-1 text-sm font-medium", gradient ? "text-current opacity-70" : "text-muted")}>{helper}</p>
    </div>
  );
}
