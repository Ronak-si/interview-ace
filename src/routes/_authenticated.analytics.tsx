import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — PrepAI" },
      { name: "description", content: "Score trends and topic-wise strengths across your rounds." },
      { property: "og:title", content: "Analytics — PrepAI" },
      { property: "og:description", content: "Score trends across your mock interviews." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" description="Deep dive into your interview performance." />
      <EmptyState
        icon={BarChart3}
        title="Full analytics arrive with the evaluation module"
        description="Once AI evaluation is in place, this page will chart score trends, topic strengths and weak areas over time."
      />
    </div>
  );
}
