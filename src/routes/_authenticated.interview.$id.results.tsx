import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Target, TriangleAlert } from "lucide-react";

import { FullPageLoader } from "@/components/common/Loaders";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInterview } from "@/services/interviewService";

export const Route = createFileRoute("/_authenticated/interview/$id/results")({
  head: () => ({
    meta: [
      { title: "Interview feedback — PrepAI" },
      { name: "description", content: "AI scoring and feedback for your mock interview." },
      { property: "og:title", content: "Interview feedback — PrepAI" },
      { property: "og:description", content: "AI scoring and feedback for your mock interview." },
    ],
  }),
  component: ResultsPage,
});

function List({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: typeof Target;
}) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="text-muted-foreground space-y-2 text-sm">
          {items.length === 0 && <li>Nothing noted.</li>}
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ResultsPage() {
  const { id } = Route.useParams();
  const { data: interview, isLoading } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterview(id),
  });

  if (isLoading) return <FullPageLoader />;

  const evaluation = interview?.evaluation;
  if (!interview || !evaluation) {
    return (
      <div className="space-y-4">
        <PageHeader title="No feedback yet" description="This interview has not been evaluated." />
        <Button asChild>
          <Link to="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  const questions = interview.questions ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Interview feedback"
        description={`${interview.role} · ${interview.difficulty}`}
        action={
          <Button asChild>
            <Link to="/interview/new">New interview</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Overall" value={`${Math.round(evaluation.overallScore)}`} icon={Target} />
        <StatCard
          label="Technical"
          value={`${Math.round(evaluation.technicalScore)}`}
          icon={Target}
        />
        <StatCard
          label="Communication"
          value={`${Math.round(evaluation.communicationScore)}`}
          icon={Target}
        />
        <StatCard
          label="Problem solving"
          value={`${Math.round(evaluation.problemSolvingScore)}`}
          icon={Target}
        />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">{evaluation.summary}</CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <List title="Strengths" items={evaluation.strengths} icon={CheckCircle2} />
        <List title="Weaknesses" items={evaluation.weaknesses} icon={TriangleAlert} />
        <List title="Suggestions" items={evaluation.suggestions} icon={Target} />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Question by question</h2>
        {evaluation.perQuestion.map((item, index) => {
          const question = questions.find((q) => q.id === item.questionId);
          return (
            <Card key={`${item.questionId}-${index}`} className="glass-card">
              <CardContent className="space-y-3 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="secondary">{question?.topic ?? `Question ${index + 1}`}</Badge>
                  <span className="text-sm font-semibold tabular-nums">
                    {Math.round(item.score)}/100
                  </span>
                </div>
                <p className="font-medium">{question?.question ?? item.questionId}</p>
                <p className="text-muted-foreground text-sm">
                  <span className="text-foreground font-medium">Your answer: </span>
                  {interview.answers?.[item.questionId]?.trim() || "(no answer given)"}
                </p>
                <p className="text-muted-foreground text-sm">
                  <span className="text-foreground font-medium">Feedback: </span>
                  {item.feedback}
                </p>
                <p className="text-muted-foreground text-sm">
                  <span className="text-foreground font-medium">Ideal answer: </span>
                  {item.idealAnswer}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
