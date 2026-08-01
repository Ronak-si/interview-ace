import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const MODEL = "google/gemini-3.6-flash";

const GenerateInput = z.object({
  role: z.string().min(2),
  difficulty: z.string().min(2),
  questionCount: z.number().int().min(3).max(20),
  focus: z.string().max(300).optional(),
});

/** Schemas sent to the model stay constraint-free — bounds are enforced in code. */
const QuestionsSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      topic: z.string(),
      hint: z.string(),
    }),
  ),
});


const EvaluateInput = z.object({
  interviewId: z.string().uuid(),
  answers: z.record(z.string(), z.string()),
  durationSeconds: z.number().int().min(0),
});

const EvaluationSchema = z.object({
  overallScore: z.number(),
  technicalScore: z.number(),
  communicationScore: z.number(),
  problemSolvingScore: z.number(),
  summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
  perQuestion: z.array(
    z.object({
      questionId: z.string(),
      score: z.number(),
      feedback: z.string(),
      idealAnswer: z.string(),
    }),
  ),
});

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Missing LOVABLE_API_KEY.");
  return createLovableAiGatewayProvider(key);
}

function aiError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("429")) throw new Error("AI rate limit reached. Please retry in a moment.");
  if (message.includes("402"))
    throw new Error("AI credits exhausted. Add credits in your workspace to continue.");
  throw new Error(message);
}

/** Generates questions with AI and stores a new in-progress interview. */
export const generateInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data, context }) => {
    let questions;
    try {
      const { output } = await generateText({
        model: gateway()(MODEL),
        output: Output.object({ schema: QuestionsSchema }),
        system:
          "You are a senior technical interviewer. Produce realistic, non-generic interview questions. Vary topics and never repeat a question.",
        prompt: `Create exactly ${data.questionCount} ${data.difficulty} interview questions for a ${data.role} role.${
          data.focus ? ` Focus areas: ${data.focus}.` : ""
        } Each item: the question, a short topic label (e.g. "React", "System Design"), and a one-line hint for the candidate.`,
      });
      questions = output.questions.slice(0, data.questionCount).map((q, index) => ({
        id: `q${index + 1}`,
        ...q,
      }));
    } catch (error) {
      aiError(error);
    }

    const { data: row, error } = await context.supabase
      .from("interviews")
      .insert({
        user_id: context.userId,
        role: data.role,
        difficulty: data.difficulty,
        question_count: questions.length,
        status: "in_progress",
        questions,
        answers: {},
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

/** Scores the submitted answers with AI and completes the interview. */
export const evaluateInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => EvaluateInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: interview, error: loadError } = await context.supabase
      .from("interviews")
      .select("*")
      .eq("id", data.interviewId)
      .single();
    if (loadError) throw new Error(loadError.message);

    const questions = (interview.questions ?? []) as {
      id: string;
      question: string;
      topic: string;
    }[];

    const transcript = questions
      .map(
        (q, i) =>
          `Q${i + 1} (id: ${q.id}, topic: ${q.topic}): ${q.question}\nAnswer: ${
            data.answers[q.id]?.trim() || "(no answer given)"
          }`,
      )
      .join("\n\n");

    let evaluation;
    try {
      const { output } = await generateText({
        model: gateway()(MODEL),
        output: Output.object({ schema: EvaluationSchema }),
        system:
          "You are a strict but fair technical interview evaluator. Scores are 0-100 integers. Unanswered questions score 0. Be concrete and actionable.",
        prompt: `Role: ${interview.role}. Difficulty: ${interview.difficulty}.\n\n${transcript}\n\nEvaluate the candidate. Return one perQuestion entry per question using the exact question id, plus overall, technical, communication and problem solving scores, a 2-3 sentence summary, strengths, weaknesses and suggestions.`,
      });
      evaluation = output;
    } catch (error) {
      aiError(error);
    }

    const { error: updateError } = await context.supabase
      .from("interviews")
      .update({
        status: "completed",
        answers: data.answers,
        evaluation,
        overall_score: Math.round(evaluation.overallScore),
        technical_score: Math.round(evaluation.technicalScore),
        communication_score: Math.round(evaluation.communicationScore),
        problem_solving_score: Math.round(evaluation.problemSolvingScore),
        duration_seconds: data.durationSeconds,
        completed_at: new Date().toISOString(),
      })
      .eq("id", data.interviewId);

    if (updateError) throw new Error(updateError.message);
    return { ok: true };
  });
