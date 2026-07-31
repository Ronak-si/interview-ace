import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Glassmorphism KPI card used across Dashboard / Analytics. */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "primary",
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "success" | "warning" | "chart-2";
  className?: string;
}) {
  const accentClass = {
    primary: "bg-primary/12 text-primary",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-warning",
    "chart-2": "bg-chart-2/12 text-chart-2",
  }[accent];

  return (
    <div
      className={cn(
        "glass-card animate-rise transition-smooth relative overflow-hidden rounded-2xl p-5 hover:-translate-y-0.5",
        className,
      )}
    >
      <div className="mesh-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            {label}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight">{value}</p>
          {hint && <p className="text-muted-foreground mt-1 text-xs">{hint}</p>}
        </div>
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", accentClass)}>
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  );
}
