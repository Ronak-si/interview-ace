import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateInterview } from "@/lib/interview.functions";
import { DIFFICULTIES, INTERVIEW_ROLES, QUESTION_COUNTS } from "@/utils/constants";
import { cn } from "@/lib/utils";

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

type FormValues = { focus: string };

function OptionRow<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
              option === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {String(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function NewInterviewPage() {
  const navigate = useNavigate();
  const generate = useServerFn(generateInterview);
  const [role, setRole] = useState<string>(INTERVIEW_ROLES[0]);
  const [difficulty, setDifficulty] = useState<string>(DIFFICULTIES[1]);
  const [questionCount, setQuestionCount] = useState<number>(QUESTION_COUNTS[0]);
  const [pending, setPending] = useState(false);
  const { register, handleSubmit } = useForm<FormValues>({ defaultValues: { focus: "" } });

  const onSubmit = handleSubmit(async (values) => {
    setPending(true);
    try {
      const result = await generate({
        data: {
          role,
          difficulty,
          questionCount,
          ...(values.focus.trim() ? { focus: values.focus.trim() } : {}),
        },
      });
      toast.success("Interview ready");
      await navigate({ to: "/interview/$id", params: { id: result.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate the interview");
    } finally {
      setPending(false);
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="New interview"
        description="Pick a role, difficulty and question count to generate a round."
      />
      <Card className="glass-card max-w-3xl">
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <OptionRow label="Role" options={INTERVIEW_ROLES} value={role} onChange={setRole} />
            <OptionRow
              label="Difficulty"
              options={DIFFICULTIES}
              value={difficulty}
              onChange={setDifficulty}
            />
            <OptionRow
              label="Questions"
              options={QUESTION_COUNTS}
              value={questionCount}
              onChange={setQuestionCount}
            />
            <div className="space-y-2">
              <Label htmlFor="focus">Focus areas (optional)</Label>
              <Textarea
                id="focus"
                rows={3}
                placeholder="e.g. React performance, state management, system design"
                {...register("focus")}
              />
            </div>
            <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating questions…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" /> Generate interview
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
