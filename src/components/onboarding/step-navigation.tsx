import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface StepNavigationProps {
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  backLabel?: string;
  continueDisabled?: boolean;
  showBack?: boolean;
}

export function StepNavigation({ 
  onBack, 
  onContinue, 
  continueLabel = "Continue",
  backLabel = "Back",
  continueDisabled = false,
  showBack = true
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      {showBack ? (
        <button
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
          onClick={onBack}
          type="button"
        >
          ← {backLabel}
        </button>
      ) : <div />}
      
      <Button 
        size="lg" 
        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full px-6 h-12 text-sm" 
        onClick={onContinue}
        disabled={continueDisabled}
        type="button"
      >
        {continueLabel}
        <ChevronRight className="h-5 w-5 ml-1" />
      </Button>
    </div>
  );
}
