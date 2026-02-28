"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  ALL_DIMENSIONS,
  useJudgeStore,
  type JudgeDimension,
  type RunJudgeOptions,
} from "@/stores/judgeStore";
import { useTraceDetailStore } from "@/stores/traceDetailStore";
import { JudgeResults } from "./JudgeResults";
import { PastAnalysesList } from "./PastAnalysesList";
import { RunControls } from "./RunControls";
import type { JudgeMode } from "./types";

interface JudgePanelProps {
  traceId: string;
}

export function JudgePanel({ traceId }: JudgePanelProps) {
  const {
    judgeResult,
    pastAnalyses,
    isRunning,
    isLoading,
    error,
    runJudge,
    fetchPastAnalyses,
    fetchAnalysisDetail,
    reset,
  } = useJudgeStore();

  const systemPrompt = useTraceDetailStore((state) => state.trace?.systemPrompt || "");

  const [selectedDimensions, setSelectedDimensions] = useState<JudgeDimension[]>([...ALL_DIMENSIONS]);
  const [mode, setMode] = useState<JudgeMode>("standard");

  useEffect(() => {
    fetchPastAnalyses(traceId);
    return () => reset();
  }, [traceId, fetchPastAnalyses, reset]);

  const handleRun = useCallback(() => {
    const options: RunJudgeOptions = {
      dimensions:
        selectedDimensions.length < ALL_DIMENSIONS.length ? selectedDimensions : undefined,
      mode,
    };
    runJudge(traceId, options);
  }, [traceId, selectedDimensions, mode, runJudge]);

  const toggleDimension = (dimension: JudgeDimension) => {
    setSelectedDimensions((prev) =>
      prev.includes(dimension)
        ? prev.filter((existingDimension) => existingDimension !== dimension)
        : [...prev, dimension]
    );
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-background">
      <div className="mx-auto flex w-full flex-col gap-5 p-5 lg:p-6">
        <RunControls
          selectedDimensions={selectedDimensions}
          mode={mode}
          onModeChange={setMode}
          onToggleDimension={toggleDimension}
          onRun={handleRun}
          isRunning={isRunning}
        />

        {error ? (
          <div className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {isRunning ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-14">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-base font-semibold text-foreground">Running LLM Judge analysis</p>
              <p className="text-sm text-muted-foreground">This usually takes 30 to 60 seconds.</p>
            </CardContent>
          </Card>
        ) : null}

        {judgeResult && !isRunning ? (
          <JudgeResults result={judgeResult} systemPrompt={systemPrompt} />
        ) : null}

        {pastAnalyses.length > 0 && !isRunning ? (
          <PastAnalysesList
            analyses={pastAnalyses}
            currentId={judgeResult?.id}
            onSelect={fetchAnalysisDetail}
            isLoading={isLoading}
          />
        ) : null}
      </div>
    </div>
  );
}
