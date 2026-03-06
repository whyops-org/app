import { create } from "zustand";

import { apiClient } from "@/lib/api-client";
import { useAgentsStore } from "@/stores/agentsStore";
import { useConfigStore } from "@/stores/configStore";
import type { AgentGlobalLimits, AgentSettings } from "@/types/global";

interface AgentSettingsState {
  settingsByAgentId: Record<string, AgentSettings>;
  globalLimits: AgentGlobalLimits | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchGlobalLimits: () => Promise<AgentGlobalLimits | null>;
  fetchAgentSettings: (agentId: string) => Promise<AgentSettings | null>;
  updateAgentSettings: (
    agentId: string,
    payload: Partial<Pick<AgentSettings, "samplingRate" | "maxTraces" | "maxSpans">>
  ) => Promise<AgentSettings | null>;
  resetAgentSettings: (agentId: string) => Promise<AgentSettings | null>;
}

export const useAgentSettingsStore = create<AgentSettingsState>((set) => ({
  settingsByAgentId: {},
  globalLimits: null,
  isLoading: false,
  isSaving: false,
  error: null,

  fetchGlobalLimits: async () => {
    const config = useConfigStore.getState().config;
    const apiKey = useAgentsStore.getState().apiKey;

    if (!config?.analyseBaseUrl) {
      set({ error: "Analyse base URL not configured" });
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{ success: boolean; limits: AgentGlobalLimits }>(
        `${config.analyseBaseUrl}/agent-settings/limits`,
        {
          headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        }
      );

      set({ globalLimits: response.data.limits, isLoading: false });
      return response.data.limits;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch global limits";
      set({ error: message, isLoading: false });
      return null;
    }
  },

  fetchAgentSettings: async (agentId: string) => {
    const config = useConfigStore.getState().config;
    const apiKey = useAgentsStore.getState().apiKey;

    if (!config?.analyseBaseUrl) {
      set({ error: "Analyse base URL not configured" });
      return null;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{ success: boolean; settings: AgentSettings }>(
        `${config.analyseBaseUrl}/agent-settings/${agentId}`,
        {
          headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        }
      );

      const settings = response.data.settings;
      set((state) => ({
        settingsByAgentId: {
          ...state.settingsByAgentId,
          [agentId]: settings,
        },
        isLoading: false,
      }));
      return settings;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch agent settings";
      set({ error: message, isLoading: false });
      return null;
    }
  },

  updateAgentSettings: async (agentId: string, payload) => {
    const config = useConfigStore.getState().config;
    const apiKey = useAgentsStore.getState().apiKey;

    if (!config?.analyseBaseUrl) {
      set({ error: "Analyse base URL not configured" });
      return null;
    }

    set({ isSaving: true, error: null });
    try {
      const response = await apiClient.patch<{ success: boolean; settings: AgentSettings }>(
        `${config.analyseBaseUrl}/agent-settings/${agentId}`,
        payload,
        {
          headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        }
      );

      const settings = response.data.settings;
      set((state) => ({
        settingsByAgentId: {
          ...state.settingsByAgentId,
          [agentId]: settings,
        },
        isSaving: false,
      }));

      useAgentsStore.setState((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === agentId
            ? {
                ...agent,
                maxTraces: settings.maxTraces,
                maxSpans: settings.maxSpans,
                latestVersion: agent.latestVersion
                  ? {
                      ...agent.latestVersion,
                      samplingRate: settings.samplingRate,
                    }
                  : agent.latestVersion,
              }
            : agent
        ),
        currentAgent:
          state.currentAgent && state.currentAgent.id === agentId
            ? {
                ...state.currentAgent,
                maxTraces: settings.maxTraces,
                maxSpans: settings.maxSpans,
                latestVersion: state.currentAgent.latestVersion
                  ? {
                      ...state.currentAgent.latestVersion,
                      samplingRate: settings.samplingRate,
                    }
                  : state.currentAgent.latestVersion,
                versions: state.currentAgent.versions?.map((version) => ({
                  ...version,
                  samplingRate: settings.samplingRate,
                })),
              }
            : state.currentAgent,
      }));

      return settings;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update agent settings";
      set({ error: message, isSaving: false });
      return null;
    }
  },

  resetAgentSettings: async (agentId: string) => {
    const config = useConfigStore.getState().config;
    const apiKey = useAgentsStore.getState().apiKey;

    if (!config?.analyseBaseUrl) {
      set({ error: "Analyse base URL not configured" });
      return null;
    }

    set({ isSaving: true, error: null });
    try {
      const response = await apiClient.delete<{ success: boolean; settings: AgentSettings }>(
        `${config.analyseBaseUrl}/agent-settings/${agentId}`,
        {
          headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        }
      );

      const settings = response.data.settings;
      set((state) => ({
        settingsByAgentId: {
          ...state.settingsByAgentId,
          [agentId]: settings,
        },
        isSaving: false,
      }));

      useAgentsStore.setState((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === agentId
            ? {
                ...agent,
                maxTraces: settings.maxTraces,
                maxSpans: settings.maxSpans,
                latestVersion: agent.latestVersion
                  ? {
                      ...agent.latestVersion,
                      samplingRate: settings.samplingRate,
                    }
                  : agent.latestVersion,
              }
            : agent
        ),
        currentAgent:
          state.currentAgent && state.currentAgent.id === agentId
            ? {
                ...state.currentAgent,
                maxTraces: settings.maxTraces,
                maxSpans: settings.maxSpans,
                latestVersion: state.currentAgent.latestVersion
                  ? {
                      ...state.currentAgent.latestVersion,
                      samplingRate: settings.samplingRate,
                    }
                  : state.currentAgent.latestVersion,
                versions: state.currentAgent.versions?.map((version) => ({
                  ...version,
                  samplingRate: settings.samplingRate,
                })),
              }
            : state.currentAgent,
      }));

      return settings;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reset agent settings";
      set({ error: message, isSaving: false });
      return null;
    }
  },
}));
