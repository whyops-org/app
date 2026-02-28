import { AlertTriangle, ChevronLeft, ChevronRight, ListChecks, Wrench } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiffViewer } from "@/components/ui/diff-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { JudgeFinding } from "@/stores/judgeStore";
import { DimensionBadge, ScoreCircle, SeverityBadge } from "../judge-score";
import { ISSUES_PER_PAGE } from "./constants";
import { SystemPromptDialog } from "./SystemPromptDialog";
import type { FindingDetailTab } from "./types";
import { buildPromptAwarePatchDiff, formatScore, toSingleLine } from "./utils";

interface FindingDetailPanelProps {
  finding: JudgeFinding | null;
  systemPrompt: string;
}

export function FindingDetailPanel({ finding, systemPrompt }: FindingDetailPanelProps) {
  const [detailTab, setDetailTab] = useState<FindingDetailTab>("overview");
  const [issuePage, setIssuePage] = useState(0);
  const [selectedPatchIndex, setSelectedPatchIndex] = useState(0);

  if (!finding) {
    return <EmptyPanel text="Select a finding to view details." />;
  }

  const issues = finding.evidence?.issues || [];
  const patches = finding.recommendation?.patches || [];
  const score = finding.evidence?.score ?? -1;
  const issuePageCount = Math.max(1, Math.ceil(issues.length / ISSUES_PER_PAGE));
  const safeIssuePage = Math.min(issuePage, issuePageCount - 1);
  const pagedIssues = issues.slice(
    safeIssuePage * ISSUES_PER_PAGE,
    safeIssuePage * ISSUES_PER_PAGE + ISSUES_PER_PAGE
  );

  const safePatchIndex = Math.min(selectedPatchIndex, Math.max(0, patches.length - 1));
  const selectedPatch = patches[safePatchIndex] ?? null;
  const diffPayload = selectedPatch
    ? buildPromptAwarePatchDiff(systemPrompt, selectedPatch)
    : null;

  return (
    <div className="space-y-4 rounded-sm border border-border/60 bg-surface-2/20 p-4 lg:p-5">
      <div className="flex flex-col gap-3 border-b border-border/45 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <DimensionBadge dimension={finding.dimension} />
            <SeverityBadge severity={finding.severity} />
            {finding.stepId != null ? <Badge>Step {finding.stepId}</Badge> : null}
          </div>

          <p className="text-sm text-muted-foreground">
            Confidence {Math.round(finding.confidence * 100)}% • {issues.length} issue
            {issues.length === 1 ? "" : "s"} • {patches.length} patch
            {patches.length === 1 ? "" : "es"}
          </p>
        </div>

        <ScoreCircle score={score} size="sm" label="Score" />
      </div>

      <Tabs value={detailTab} onValueChange={(value) => setDetailTab(value as FindingDetailTab)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="issues" className="text-sm">
            Issues
          </TabsTrigger>
          <TabsTrigger value="patches" className="text-sm">
            Patches
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <section className="space-y-2">
            <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Recommendation
            </h4>
            <div className="rounded-sm border border-border/55 bg-card px-3 py-3 text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{finding.recommendation.action}</span>
              {finding.recommendation.detail ? ` — ${finding.recommendation.detail}` : ""}
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatPill label="Issues" value={String(issues.length)} icon={<AlertTriangle className="h-3.5 w-3.5" />} />
            <StatPill label="Patches" value={String(patches.length)} icon={<Wrench className="h-3.5 w-3.5" />} />
            <StatPill label="Score" value={formatScore(score)} icon={<ListChecks className="h-3.5 w-3.5" />} />
          </div>

          {issues.length > 0 ? (
            <section className="space-y-2">
              <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Top Issues
              </h4>
              <div className="space-y-2">
                {issues.slice(0, 3).map((issue, index) => (
                  <div
                    key={`${issue.code}-${index}`}
                    className="rounded-sm border border-border/55 bg-card px-3 py-2.5"
                  >
                    <div className="mb-1 inline-flex rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {issue.code}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{issue.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {patches.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => setDetailTab("patches")}
            >
              Open Patch Diffs
            </Button>
          ) : null}
        </TabsContent>

        <TabsContent value="issues" className="mt-4 space-y-3">
          {issues.length === 0 ? (
            <EmptyPanel text="No issues for this finding." />
          ) : (
            <>
              <div className="max-h-[25rem] space-y-2 overflow-y-auto pr-1">
                {pagedIssues.map((issue, index) => (
                  <div
                    key={`${issue.code}-${safeIssuePage}-${index}`}
                    className="rounded-sm border border-border/55 bg-card px-3 py-3"
                  >
                    <div className="mb-1 inline-flex rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {issue.code}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{issue.detail}</p>
                  </div>
                ))}
              </div>

              {issuePageCount > 1 ? (
                <div className="flex items-center justify-between border-t border-border/45 pt-3">
                  <p className="text-sm text-muted-foreground">
                    Page {safeIssuePage + 1} of {issuePageCount}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => setIssuePage((prev) => Math.max(0, prev - 1))}
                      disabled={safeIssuePage === 0}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => setIssuePage((prev) => Math.min(issuePageCount - 1, prev + 1))}
                      disabled={safeIssuePage >= issuePageCount - 1}
                    >
                      Next
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </TabsContent>

        <TabsContent value="patches" className="mt-4 space-y-3">
          {patches.length === 0 ? (
            <EmptyPanel text="No patches suggested for this finding." />
          ) : (
            <div className="space-y-3">
              <div className="space-y-2 rounded-sm border border-border/55 bg-card px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Patch Selection
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {safePatchIndex + 1} of {patches.length}
                  </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {patches.map((patch, index) => {
                    const isActive = index === safePatchIndex;
                    const patchTitle = patch.location || `Patch ${index + 1}`;
                    return (
                      <button
                        key={`${patch.location || "patch"}-${index}`}
                        type="button"
                        onClick={() => setSelectedPatchIndex(index)}
                        className={cn(
                          "inline-flex h-8 flex-none items-center rounded-sm border px-2.5 text-xs font-medium transition-colors",
                          isActive
                            ? "border-primary/45 bg-primary/10 text-foreground"
                            : "border-border/60 bg-surface-2/40 text-muted-foreground hover:text-foreground"
                        )}
                        title={patchTitle}
                      >
                        Patch {index + 1}
                      </button>
                    );
                  })}
                </div>

                {selectedPatch ? (
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {toSingleLine(selectedPatch.location || selectedPatch.original)}
                  </p>
                ) : null}
              </div>

              {diffPayload ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-border/55 bg-card px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Diff Source
                      </p>
                      <p className="text-sm text-foreground">
                        {diffPayload.foundInPrompt
                          ? "Matched inside full system prompt"
                          : "Showing direct patch comparison"}
                      </p>
                    </div>

                    {systemPrompt ? <SystemPromptDialog prompt={systemPrompt} /> : null}
                  </div>

                  <DiffViewer
                    oldValue={diffPayload.oldValue}
                    newValue={diffPayload.newValue}
                    leftTitle={diffPayload.leftTitle}
                    rightTitle={diffPayload.rightTitle}
                    splitView
                    showDiffOnly
                    extraLinesSurroundingDiff={8}
                  />

                  <div className="rounded-sm border border-border/55 bg-card px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Rationale:</span>{" "}
                    {selectedPatch?.rationale || "No rationale provided."}
                  </div>
                </>
              ) : null}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatPill({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-sm border border-border/55 bg-card px-2.5 py-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="ml-auto text-sm font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-sm border border-dashed border-border/70 bg-surface-2/35 px-4 py-10 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
