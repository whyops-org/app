import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SystemPromptDialogProps {
  prompt: string;
}

export function SystemPromptDialog({ prompt }: SystemPromptDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          View Full Prompt
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>System Prompt</DialogTitle>
          <DialogDescription>
            Full original prompt captured for this trace.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[62vh] overflow-auto rounded-sm border border-border/60 bg-surface-2/30 p-3">
          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground">
            {prompt}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}
