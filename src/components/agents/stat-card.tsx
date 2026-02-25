import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  className,
  ...props
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "flex items-start justify-between gap-4 border-border/40 bg-card p-5",
        className
      )}
      {...props}
    >
      <div className="flex-1 space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-semibold text-foreground">{value}</h3>
          {trend && (
            <span
              className={cn(
                "text-[11px] font-medium",
                trend.isPositive ? "text-primary" : "text-destructive"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center border border-border/50 bg-surface-2/40">
          {icon}
        </div>
      )}
    </Card>
  );
}
