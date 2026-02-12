import { AgentDetailHeader } from "@/components/agents/agent-detail-header";
import { AgentDetailStats } from "@/components/agents/agent-detail-stats";
import { AgentTraceTimeline } from "@/components/agents/agent-trace-timeline";
import { RecentTracesTable } from "@/components/agents/recent-traces-table";

export default function AgentDetailsPage() {
  return (
    <div className="space-y-6 p-8">
      <AgentDetailHeader />
      <AgentDetailStats />
      <AgentTraceTimeline />
      <RecentTracesTable />
    </div>
  );
}
