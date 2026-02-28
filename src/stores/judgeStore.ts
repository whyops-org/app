import { create } from "zustand";

import { apiClient } from "@/lib/api-client";
import { useConfigStore } from "./configStore";
import { useTraceDetailStore } from "./traceDetailStore";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type JudgeDimension =
  | "step_correctness"
  | "tool_choice"
  | "prompt_quality"
  | "tool_description"
  | "cost_efficiency";

export const ALL_DIMENSIONS: JudgeDimension[] = [
  "step_correctness",
  "tool_choice",
  "prompt_quality",
  "tool_description",
  "cost_efficiency",
];

export const DIMENSION_LABELS: Record<JudgeDimension, string> = {
  step_correctness: "Step Correctness",
  tool_choice: "Tool Choice",
  prompt_quality: "Prompt Quality",
  tool_description: "Tool Description",
  cost_efficiency: "Cost Efficiency",
};

export interface JudgeIssue {
  code: string;
  detail: string;
}

export interface JudgePatch {
  location?: string;
  original: string;
  suggested: string;
  rationale: string;
}

export interface JudgeRecommendation {
  action: string;
  detail: string;
  patches?: JudgePatch[];
}

export interface JudgeFinding {
  id: string;
  analysisId: string;
  stepId?: number | null;
  dimension: string;
  severity: "low" | "medium" | "high" | "critical";
  confidence: number;
  evidence: {
    score: number;
    issues: JudgeIssue[];
    [key: string]: unknown;
  };
  recommendation: JudgeRecommendation;
  createdAt: string;
  updatedAt: string;
}

export interface DimensionDetail {
  dimension: JudgeDimension;
  score: number;
  issueCount: number;
  patchCount: number;
  skipped: boolean;
  skipReason?: string;
}

export interface JudgeSummary {
  overallScore: number;
  dimensionScores: Record<string, number>;
  totalIssues: number;
  totalPatches: number;
  bySeverity: Record<string, number>;
  dimensionDetails: DimensionDetail[];
}

export interface JudgeResult {
  id: string;
  traceId: string;
  status: string;
  rubricVersion: string;
  judgeModel: string;
  mode: string;
  summary: JudgeSummary;
  findings: JudgeFinding[];
}

export interface PastAnalysis {
  id: string;
  traceId: string;
  status: string;
  rubricVersion: string;
  judgeModel: string | null;
  mode: string;
  startedAt: string;
  finishedAt: string | null;
  summary: JudgeSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface RunJudgeOptions {
  dimensions?: JudgeDimension[];
  judgeModel?: string;
  mode?: "quick" | "standard" | "deep";
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface JudgeState {
  judgeResult: JudgeResult | null;
  pastAnalyses: PastAnalysis[];
  isRunning: boolean;
  isLoading: boolean;
  error: string | null;

  runJudge: (traceId: string, options?: RunJudgeOptions) => Promise<JudgeResult | null>;
  fetchPastAnalyses: (traceId: string) => Promise<void>;
  fetchAnalysisDetail: (id: string) => Promise<JudgeResult | null>;
  reset: () => void;
}

export const useJudgeStore = create<JudgeState>()((set) => ({
  judgeResult: null,
  pastAnalyses: [],
  isRunning: false,
  isLoading: false,
  error: null,

  runJudge: async (traceId: string, options?: RunJudgeOptions) => {
    const config = useConfigStore.getState().config;
    const apiKey = useTraceDetailStore.getState().apiKey;

    if (!config?.analyseBaseUrl) {
      set({ error: "Analyse base URL not configured" });
      return null;
    }

    set({ isRunning: true, error: null });

    try {
      const response = await apiClient.post<{ success: boolean; analysis: JudgeResult }>(
        `${config.analyseBaseUrl}/analyses/judge`,
        {
          traceId,
          dimensions: options?.dimensions,
          judgeModel: options?.judgeModel,
          mode: options?.mode,
        },
        {
          headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        }
      );

      const result = response.data.analysis;
      set({ judgeResult: result, isRunning: false });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to run LLM judge";
      set({ error: message, isRunning: false });
      return null;
    }
  },

  fetchPastAnalyses: async (traceId: string) => {
    const config = useConfigStore.getState().config;
    const apiKey = useTraceDetailStore.getState().apiKey;

    if (!config?.analyseBaseUrl) {
      set({ error: "Analyse base URL not configured" });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.get<{ success: boolean; analyses: PastAnalysis[] }>(
        `${config.analyseBaseUrl}/analyses/trace/${traceId}`,
        {
          headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        }
      );

      set({ pastAnalyses: response.data.analyses, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch past analyses";
      set({ error: message, isLoading: false });
    }
  },

  fetchAnalysisDetail: async (id: string) => {
    const config = useConfigStore.getState().config;
    const apiKey = useTraceDetailStore.getState().apiKey;

    if (!config?.analyseBaseUrl) {
      set({ error: "Analyse base URL not configured" });
      return null;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await apiClient.get<{ success: boolean; analysis: JudgeResult }>(
        `${config.analyseBaseUrl}/analyses/${id}`,
        {
          headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        }
      );

      const result = response.data.analysis;
      set({ judgeResult: result, isLoading: false });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch analysis";
      set({ error: message, isLoading: false });
      return null;
    }
  },

  reset: () =>
    set({
      judgeResult: null,
      pastAnalyses: [],
      isRunning: false,
      isLoading: false,
      error: null,
    }),
}));
