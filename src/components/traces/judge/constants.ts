import type { FindingCategory, JudgeMode } from "./types";

export const MODE_LABELS: Record<JudgeMode, string> = {
  quick: "Quick",
  standard: "Standard",
  deep: "Deep",
};

export const FINDING_CATEGORY_LABELS: Record<FindingCategory, string> = {
  all: "All",
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  patches: "With Patches",
};

export const FINDING_CATEGORIES: FindingCategory[] = [
  "all",
  "critical",
  "high",
  "medium",
  "low",
  "patches",
];

export const REVIEW_FLOW_STEPS = [
  {
    title: "Run",
    description: "Choose mode and dimensions, then execute analysis.",
  },
  {
    title: "Review",
    description: "Filter findings by dimension and severity.",
  },
  {
    title: "Apply",
    description: "Use prompt-context diffs to implement fixes safely.",
  },
] as const;

export const ISSUES_PER_PAGE = 5;
