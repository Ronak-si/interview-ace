import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { evaluateInterviewAnswers, generateInterviewQuestions } from "@/lib/interview.server";

/** Generates questions with AI and stores a new in-progress interview. */
export const generateInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        role: z.string().min(2),
        difficulty: z.string().min(2),
        questionCount: z.number().int().min(3).max(20),
        focus: z.string().max(300).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const questions = await generateInterviewQuestions(data);

    if (questions.length === 0) {
      throw new Error("The AI returned no questions. Please try again.");
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
  .inputValidator((input: unknown) =>
    z
      .object({
        interviewId: z.string().uuid(),
        answers: z.record(z.string(), z.string()),
        durationSeconds: z.number().int().min(0),
      })
      .parse(input),
  )
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

    const evaluation = await evaluateInterviewAnswers(
      `Role: ${interview.role}. Difficulty: ${interview.difficulty}.\n\n${transcript}\n\nEvaluate the candidate. Return one perQuestion entry per question using the exact question id, plus overall, technical, communication and problem solving scores, a 2-3 sentence summary, strengths, weaknesses and suggestions.`,
    );


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
