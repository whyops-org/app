import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StepContainerProps {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
}

export function StepContainer({ children, className, maxHeight = "70vh" }: StepContainerProps) {
  return (
    <div 
      className={cn(
        "w-full rounded-3xl  overflow-hidden flex flex-col",
        className
      )}
      style={{ maxHeight }}
    >
      <div className="flex-1 overflow-y-auto p-8 pb-24 space-y-6 scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
        {children}
      </div>
    </div>
  );
}
