import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface InfoBoxProps {
  variant?: "info" | "success" | "warning" | "error";
  icon?: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}

const variantStyles = {
  info: {
    container: "border-blue-500/50 bg-card",
    iconBg: "bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    iconColor: "text-blue-500",
    titleColor: "text-blue-500",
    contentColor: "text-blue-500",
  },
  success: {
    container: "border-primary/20 bg-card",
    iconBg: "bg-primary/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    iconColor: "text-primary",
    titleColor: "text-primary",
    contentColor: "text-primary/60",
  },
  warning: {
    container: "border-yellow-600/30 bg-card",
    iconBg: "bg-yellow-600/20 border border-yellow-600",
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-500",
    contentColor: "text-muted-foreground",
  },
  error: {
    container: "border-destructive/20 bg-card",
    iconBg: "bg-destructive/10 border border-destructive/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
    iconColor: "text-destructive",
    titleColor: "text-destructive",
    contentColor: "text-destructive/80",
  },
};

export function InfoBox({ 
  variant = "info", 
  icon: Icon, 
  title, 
  children,
  className 
}: InfoBoxProps) {
  const styles = variantStyles[variant];
  
  return (
    <div className={cn(
      "flex items-start gap-4 rounded-xl border p-5",
      styles.container,
      className
    )}>
    {Icon && <div className={cn(
        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        styles.iconBg
      )}>
        <Icon className={cn("h-5 w-5", styles.iconColor)} />
      </div>}
      <div className="flex-1 space-y-2.5">
        {title && <p className={cn("text-sm font-semibold tracking-[0.12em] uppercase", styles.titleColor)}>{title}</p>}
        <div className={cn("text-sm leading-relaxed", styles.contentColor)}>
          {children}
        </div>
      </div>
    </div>
  );
}
