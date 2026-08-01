import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight, Clock, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { FullPageLoader } from "@/components/common/Loaders";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { evaluateInterview } from "@/lib/interview.functions";
import { getInterview } from "@/services/interviewService";

export const Route = createFileRoute("/_authenticated/interview/$id")({
  head: () => ({
    meta: [
      { title: "Interview room — PrepAI" },
      { name: "description", content: "Answer your AI-generated interview questions." },
      { property: "og:title", content: "Interview room — PrepAI" },
      { property: "og:description", content: "Answer your AI-generated interview questions." },
    ],
  }),
  component: InterviewRoom,
});

function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function InterviewRoom() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const evaluate = useServerFn(evaluateInterview);

  const { data: interview, isLoading } = useQuery({
    queryKey: ["interview", id],
    queryFn: () => getInterview(id),
  });

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const startedRef = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (interview?.status === "completed") {
      void navigate({ to: "/interview/$id/results", params: { id }, replace: true });
    }
  }, [interview?.status, id, navigate]);

  const questions = useMemo(() => interview?.questions ?? [], [interview]);
  const current = questions[index];

  if (isLoading) return <FullPageLoader />;
  if (!interview || !current) {
    return (
      <div className="space-y-4">
        <PageHeader title="Interview not found" description="This round no longer exists." />
        <Button onClick={() => void navigate({ to: "/interview/new" })}>
          Start a new interview
        </Button>
      </div>
    );
  }

  const answered = questions.filter((q) => (answers[q.id] ?? "").trim().length > 0).length;

  const submit = async () => {
    setSubmitting(true);
    try {
      await evaluate({ data: { interviewId: id, answers, durationSeconds: elapsed } });
      toast.success("Evaluation ready");
      await navigate({ to: "/interview/$id/results", params: { id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Evaluation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${interview.role} · ${interview.difficulty}`}
        description={`Question ${index + 1} of ${questions.length}`}
        action={
          <span className="text-muted-foreground inline-flex items-center gap-2 text-sm font-medium tabular-nums">
            <Clock className="h-4 w-4" /> {formatClock(elapsed)}
          </span>
        }
      />

      <Progress value={((index + 1) / questions.length) * 100} />

      <Card className="glass-card">
        <CardContent className="space-y-5 pt-6">
          <Badge variant="secondary">{current.topic}</Badge>
          <h2 className="text-xl leading-snug font-semibold">{current.question}</h2>
          {current.hint && (
            <p className="text-muted-foreground flex items-start gap-2 text-sm">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
              {current.hint}
            </p>
          )}
          <Textarea
            rows={10}
            placeholder="Type your answer…"
            value={answers[current.id] ?? ""}
            onChange={(event) =>
              setAnswers((prev) => ({ ...prev, [current.id]: event.target.value }))
            }
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>

        <span className="text-muted-foreground text-sm">
          {answered}/{questions.length} answered
        </span>

        {index < questions.length - 1 ? (
          <Button onClick={() => setIndex((i) => i + 1)}>
            Next <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => void submit()} disabled={submitting || answered === 0}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating…
              </>
            ) : (
              "Finish & evaluate"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
