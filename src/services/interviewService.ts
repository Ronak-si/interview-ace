import { supabase } from "@/integrations/supabase/client";

export type InterviewQuestion = {
  id: string;
  question: string;
  topic: string;
  hint?: string;
};

export type InterviewRecord = {
  id: string;
  user_id: string;
  role: string;
  difficulty: string;
  question_count: number;
  status: "in_progress" | "completed";
  questions: InterviewQuestion[];
  answers: Record<string, string>;
  evaluation: EvaluationResult | null;
  overall_score: number | null;
  technical_score: number | null;
  communication_score: number | null;
  problem_solving_score: number | null;
  duration_seconds: number;
  created_at: string;
  completed_at: string | null;
};

export type EvaluationResult = {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  perQuestion: {
    questionId: string;
    score: number;
    feedback: string;
    idealAnswer: string;
  }[];
};

/** All interviews for the signed-in user, newest first. */
export async function listInterviews(): Promise<InterviewRecord[]> {
  const { data, error } = await supabase
    .from("interviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as InterviewRecord[];
}

/** A single interview by id (RLS guarantees ownership). */
export async function getInterview(id: string): Promise<InterviewRecord | null> {
  const { data, error } = await supabase.from("interviews").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as InterviewRecord) ?? null;
}

/** Aggregates used by the dashboard + analytics screens. */
export function summarise(interviews: InterviewRecord[]) {
  const completed = interviews.filter((i) => i.status === "completed" && i.overall_score !== null);
  const scores = completed.map((i) => Number(i.overall_score));
  const average = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;
  const best = scores.length ? Math.round(Math.max(...scores)) : null;

  return {
    total: interviews.length,
    completed: completed.length,
    inProgress: interviews.length - completed.length,
    average,
    best,
    practiceMinutes: Math.round(
      interviews.reduce((acc, i) => acc + (i.duration_seconds ?? 0), 0) / 60,
    ),
    /** Oldest -> newest, ready for Recharts. */
    trend: [...completed].reverse().map((i, index) => ({
      name: `#${index + 1}`,
      score: Math.round(Number(i.overall_score)),
      date: i.completed_at ?? i.created_at,
      role: i.role,
    })),
  };
}
