import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;
  
  return (
    <div className={cn("sticky top-0 z-10 w-full space-y-4 h-[10dvh] ", className)}>
      {/* Step Labels */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <div 
              key={step.id}
              className={cn(
                "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition-colors",
                index === currentStep 
                  ? "text-foreground" 
                  : index < currentStep 
                    ? "text-primary" 
                    : "text-muted-foreground/50"
              )}
            >
              {index > 0 && <span className="text-border">•</span>}
              <span>{step.label}</span>
            </div>
          ))}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      {/* Progress Bar */}
      <Progress value={progress} className="h-2" />
      

    </div>
  );
}
