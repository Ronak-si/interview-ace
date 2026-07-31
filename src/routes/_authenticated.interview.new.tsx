import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";

export const Route = createFileRoute("/_authenticated/interview/new")({
  head: () => ({
    meta: [
      { title: "New interview — PrepAI" },
      { name: "description", content: "Generate an AI mock interview for your target role." },
      { property: "og:title", content: "New interview — PrepAI" },
      { property: "og:description", content: "Generate an AI mock interview in seconds." },
    ],
  }),
  component: NewInterviewPage,
});

function NewInterviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="New interview"
        description="Pick a role, difficulty and question count to generate a round."
      />
      <EmptyState
        icon={Sparkles}
        title="AI interview generator lands in the next module"
        description="Authentication and the dashboard are live. Ask me to continue and I'll wire up AI question generation, the interview screen and evaluation."
      />
    </div>
  );
}
