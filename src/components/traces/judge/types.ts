import type { JudgeDimension } from "@/stores/judgeStore";

export type JudgeMode = "quick" | "standard" | "deep";
export type DimensionTab = "all" | JudgeDimension;
export type FindingCategory = "all" | "critical" | "high" | "medium" | "low" | "patches";
export type FindingDetailTab = "overview" | "issues" | "patches";

export interface PromptAwareDiff {
  oldValue: string;
  newValue: string;
  leftTitle: string;
  rightTitle: string;
  foundInPrompt: boolean;
}
