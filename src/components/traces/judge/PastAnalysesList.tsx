import { Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PastAnalysis } from "@/stores/judgeStore";
import { formatRelativeTime, getScoreClass } from "./utils";

interface PastAnalysesListProps {
  analyses: PastAnalysis[];
  currentId?: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export function PastAnalysesList({ analyses, currentId, onSelect, isLoading }: PastAnalysesListProps) {
  const sortedAnalyses = [...analyses].sort((a, b) => {
    const aTime = new Date(a.finishedAt || a.createdAt).getTime();
    const bTime = new Date(b.finishedAt || b.createdAt).getTime();
    return bTime - aTime;
  });

  return (
    <Card className="border-border/55 bg-card/95">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock3 className="h-4 w-4 text-muted-foreground" />
            Past Analyses
          </CardTitle>
          <Badge className="text-[10px]">{sortedAnalyses.length} runs</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        <div className="overflow-x-auto pb-1">
          <div className="flex min-w-max gap-3">
            {sortedAnalyses.map((analysis) => {
              const isActive = analysis.id === currentId;
              const overallScore = analysis.summary?.overallScore;
              const completedAt = analysis.finishedAt || analysis.createdAt;

              return (
                <button
                  key={analysis.id}
                  type="button"
                  onClick={() => onSelect(analysis.id)}
                  disabled={isLoading}
                  className={cn(
                    "w-[270px] shrink-0 rounded-sm border p-3 text-left transition-colors",
                    isActive
                      ? "border-primary/45 bg-primary/10"
                      : "border-border/60 bg-surface-2/25 hover:border-border hover:bg-surface-2/45"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {analysis.id.substring(0, 8)}
                    </span>
                    {isActive ? (
                      <Badge className="border-primary/30 bg-primary/10 text-[10px] text-primary">
                        Current
                      </Badge>
                    ) : null}
                  </div>

                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Score
                      </p>
                      {overallScore != null && overallScore >= 0 ? (
                        <p className={cn("text-xl font-semibold tabular-nums", getScoreClass(overallScore))}>
                          {Math.round(overallScore * 100)}
                        </p>
                      ) : (
                        <p className="text-xl font-semibold text-muted-foreground">N/A</p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        Mode
                      </p>
                      <p className="text-sm font-medium capitalize text-foreground">{analysis.mode}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge className="text-[10px]">{analysis.rubricVersion}</Badge>
                    {analysis.judgeModel ? (
                      <span className="truncate text-xs text-muted-foreground">{analysis.judgeModel}</span>
                    ) : null}
                  </div>

                  <div className="mt-2 border-t border-border/45 pt-2 text-xs text-muted-foreground">
                    {formatRelativeTime(completedAt)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Click any run card to load that analysis.</span>
        </div>
      </CardContent>
    </Card>
  );
}
