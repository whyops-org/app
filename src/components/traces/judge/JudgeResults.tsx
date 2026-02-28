import { AlertTriangle, CheckCircle2, Wrench } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  JudgeDimension,
  JudgeResult,
} from "@/stores/judgeStore";
import { DIMENSION_LABELS } from "@/stores/judgeStore";
import {
  ScoreBar,
  ScoreCircle,
  SeverityBadge,
} from "../judge-score";
import { FindingsWorkbench } from "./FindingsWorkbench";

interface JudgeResultsProps {
  result: JudgeResult;
  systemPrompt: string;
}

export function JudgeResults({ result, systemPrompt }: JudgeResultsProps) {
  const { summary, findings } = result;

  const severityEntries = Object.entries(summary.bySeverity).filter(([, count]) => Number(count) > 0) as Array<
    ["low" | "medium" | "high" | "critical", number]
  >;

  return (
    <div className="space-y-5">
      <Card className="border-border/55 bg-card/95">
        <CardContent className="pt-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
            <ScoreCircle score={summary.overallScore} size="lg" label="Overall" className="shrink-0" />

            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold text-foreground">Analysis complete</span>
                <Badge className="h-5 border-primary/30 bg-primary/10 px-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                  {result.status}
                </Badge>
              </div>

              <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                <MetaField label="Model" value={result.judgeModel} />
                <MetaField label="Mode" value={result.mode} capitalize />
                <MetaField label="Issues" value={String(summary.totalIssues)} />
                <MetaField label="Patches" value={String(summary.totalPatches)} />
              </div>

              {severityEntries.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {severityEntries.map(([severity, count]) => (
                    <div
                      key={severity}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-border/55 bg-surface-2/40 px-2 py-1"
                    >
                      <SeverityBadge severity={severity} />
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {summary.dimensionDetails.map((detail) => (
          <DimensionScoreCard key={detail.dimension} detail={detail} />
        ))}
      </div>

      {findings.length > 0 ? (
        <FindingsWorkbench findings={findings} systemPrompt={systemPrompt} />
      ) : (
        <Card>
          <CardContent className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            No findings were reported for this analysis.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface MetaFieldProps {
  label: string;
  value: string;
  capitalize?: boolean;
}

function MetaField({ label, value, capitalize = false }: MetaFieldProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-sm border border-border/55 bg-surface-2/30 px-2.5 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("truncate font-medium text-foreground", capitalize && "capitalize")}>{value}</span>
    </div>
  );
}

interface DimensionScoreCardProps {
  detail: {
    dimension: JudgeDimension;
    score: number;
    issueCount: number;
    patchCount: number;
    skipped: boolean;
    skipReason?: string;
  };
}

function DimensionScoreCard({ detail }: DimensionScoreCardProps) {
  const label = DIMENSION_LABELS[detail.dimension] || detail.dimension;

  if (detail.skipped) {
    return (
      <Card className="border-border/45 bg-surface-2/40">
        <CardContent className="space-y-2 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <Badge className="h-5 border-border/70 bg-surface-2/60 px-1.5 text-[10px] text-muted-foreground">
              Skipped
            </Badge>
          </div>

          {detail.skipReason ? <p className="text-sm text-muted-foreground">{detail.skipReason}</p> : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/55 bg-card/95">
      <CardContent className="space-y-3 py-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <ScoreCircle score={detail.score} size="sm" />
        </div>

        <ScoreBar score={detail.score} />

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            {detail.issueCount} issue{detail.issueCount === 1 ? "" : "s"}
          </span>

          <span className="inline-flex items-center gap-1">
            <Wrench className="h-3.5 w-3.5" />
            {detail.patchCount} patch{detail.patchCount === 1 ? "" : "es"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
