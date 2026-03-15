import * as React from "react";

import { cn } from "@/lib/utils";

const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex min-h-6 items-center rounded-sm border border-border/70 bg-surface-2 px-2.5 py-1 text-xs font-medium tracking-normal text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge };
