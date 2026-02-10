import * as React from "react";

import { cn } from "@/lib/utils";

interface LogoMarkProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md";
}

export function LogoMark({ className, size = "md", ...props }: LogoMarkProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-xl bg-primary/15",
        sizes[size],
        className
      )}
      {...props}
    >
      <svg
        viewBox="0 0 48 48"
        className="h-4 w-4 text-primary"
        fill="currentColor"
        aria-hidden="true"
      >
        <rect x="6" y="6" width="12" height="12" rx="3" />
        <rect x="30" y="6" width="12" height="12" rx="3" />
        <rect x="18" y="18" width="12" height="12" rx="3" />
        <rect x="6" y="30" width="12" height="12" rx="3" />
        <rect x="30" y="30" width="12" height="12" rx="3" />
      </svg>
    </div>
  );
}
