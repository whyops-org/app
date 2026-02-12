import { EmptyState } from "@/components/dashboard/empty-state";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | WhyOps",
  description: "WhyOps Dashboard - Monitor your AI agents",
};

export default function DashboardPage() {
  return <EmptyState />;
}
