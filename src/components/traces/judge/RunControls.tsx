import { Play, Scale } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ALL_DIMENSIONS,
  DIMENSION_LABELS,
  type JudgeDimension,
} from "@/stores/judgeStore";
import { MODE_LABELS, REVIEW_FLOW_STEPS } from "./constants";
import type { JudgeMode } from "./types";

interface RunControlsProps {
  selectedDimensions: JudgeDimension[];
  mode: JudgeMode;
  onModeChange: (mode: JudgeMode) => void;
  onToggleDimension: (dimension: JudgeDimension) => void;
  onRun: () => void;
  isRunning: boolean;
}

export function RunControls({
  selectedDimensions,
  mode,
  onModeChange,
  onToggleDimension,
  onRun,
  isRunning,
}: RunControlsProps) {
  return (
    <Card className="border-border/55 bg-card/95">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="h-4 w-4 text-muted-foreground" />
              LLM Judge
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Run an evaluation, review findings, then apply patches from contextual diffs.
            </p>
          </div>

          <div className="inline-flex items-center rounded-sm border border-border/70 bg-surface-2/60 p-0.5">
            {(Object.keys(MODE_LABELS) as JudgeMode[]).map((modeOption) => {
              const isActive = modeOption === mode;
              return (
                <button
                  key={modeOption}
                  type="button"
                  onClick={() => onModeChange(modeOption)}
                  className={cn(
                    "h-8 rounded-sm px-3 text-xs font-semibold uppercase tracking-wide transition-colors",
                    isActive
                      ? "bg-card text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {MODE_LABELS[modeOption]}
                </button>
              );
            })}
          </div>
        </div>

        <ReviewFlowStrip />
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2.5">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Evaluation Dimensions
          </p>

          <div className="flex flex-wrap gap-2">
            {ALL_DIMENSIONS.map((dimension) => {
              const isSelected = selectedDimensions.includes(dimension);
              return (
                <button
                  key={dimension}
                  type="button"
                  onClick={() => onToggleDimension(dimension)}
                  className={cn(
                    "inline-flex h-8 items-center gap-2 rounded-sm border px-3 text-xs font-medium transition-colors",
                    isSelected
                      ? "border-primary/45 bg-primary/10 text-foreground"
                      : "border-border/60 bg-surface-2/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      isSelected ? "bg-primary" : "bg-border"
                    )}
                  />
                  {DIMENSION_LABELS[dimension]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border/45 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedDimensions.length} of {ALL_DIMENSIONS.length} dimensions selected
          </p>

          <Button
            size="sm"
            variant="primary"
            onClick={onRun}
            disabled={isRunning || selectedDimensions.length === 0}
            loading={isRunning}
            className="h-9 gap-2 px-4"
          >
            <Play className="h-3.5 w-3.5" />
            Run Judge
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewFlowStrip() {
  return (
    <div className="mt-1 grid gap-2 sm:grid-cols-3">
      {REVIEW_FLOW_STEPS.map((step, index) => (
        <div
          key={step.title}
          className="rounded-sm border border-border/55 bg-surface-2/30 px-3 py-2"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {index + 1}. {step.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-foreground/85">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
