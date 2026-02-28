import type { JudgePatch } from "@/stores/judgeStore";
import type { PromptAwareDiff } from "./types";

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export function formatScore(score: number): string {
  if (!Number.isFinite(score) || score < 0) {
    return "N/A";
  }

  return String(Math.round(score * 100));
}

export function getScoreClass(score: number): string {
  if (!Number.isFinite(score) || score < 0) {
    return "text-muted-foreground";
  }
  if (score >= 0.7) {
    return "text-primary";
  }
  if (score >= 0.5) {
    return "text-warning";
  }
  return "text-destructive";
}

export function toSingleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function buildPromptAwarePatchDiff(systemPrompt: string, patch: JudgePatch): PromptAwareDiff {
  const prompt = normalizeText(systemPrompt);
  const original = normalizeText(patch.original);
  const suggested = normalizeText(patch.suggested);

  if (!prompt || !original) {
    return {
      oldValue: original || "",
      newValue: suggested || "",
      leftTitle: "Original Patch Text",
      rightTitle: "Suggested Patch Text",
      foundInPrompt: false,
    };
  }

  const match = findSnippetInPrompt(prompt, original);

  if (!match) {
    return {
      oldValue: original,
      newValue: suggested,
      leftTitle: "Original Patch Text",
      rightTitle: "Suggested Patch Text",
      foundInPrompt: false,
    };
  }

  const contextRadius = 280;
  const contextStart = Math.max(0, match.start - contextRadius);
  const contextEnd = Math.min(prompt.length, match.end + contextRadius);
  const originalContext = prompt.slice(contextStart, contextEnd);
  const localStart = match.start - contextStart;
  const localEnd = localStart + match.matchedText.length;

  const updatedContext = `${originalContext.slice(0, localStart)}${suggested}${originalContext.slice(localEnd)}`;

  return {
    oldValue: originalContext,
    newValue: updatedContext,
    leftTitle: "Original Prompt Context",
    rightTitle: "Suggested Prompt Context",
    foundInPrompt: true,
  };
}

function findSnippetInPrompt(
  prompt: string,
  snippet: string
): { start: number; end: number; matchedText: string } | null {
  const directCandidates = Array.from(
    new Set([snippet, snippet.trim(), snippet.replace(/\r\n/g, "\n")])
  ).filter((candidate) => candidate.length > 0);

  for (const candidate of directCandidates) {
    const index = prompt.indexOf(candidate);
    if (index !== -1) {
      return {
        start: index,
        end: index + candidate.length,
        matchedText: candidate,
      };
    }
  }

  const compactSnippet = snippet.trim();
  if (compactSnippet.length < 12) {
    return null;
  }

  const flexibleWhitespaceRegex = new RegExp(
    escapeRegExp(compactSnippet).replace(/\s+/g, "\\\\s+"),
    "m"
  );
  const regexMatch = flexibleWhitespaceRegex.exec(prompt);

  if (!regexMatch || regexMatch.index < 0) {
    return null;
  }

  return {
    start: regexMatch.index,
    end: regexMatch.index + regexMatch[0].length,
    matchedText: regexMatch[0],
  };
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeText(text: string): string {
  return text.replace(/\r\n/g, "\n");
}
