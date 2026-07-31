/**
 * Application-wide constants.
 * Kept in one place so pages/forms never hardcode option lists.
 */

export const APP_NAME = "PrepAI";
export const APP_TAGLINE = "AI interview prep for frontend engineers";

export const INTERVIEW_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "SDE",
] as const;

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export const QUESTION_COUNTS = [5, 8, 10, 15] as const;

export const EXPERIENCE_LEVELS = [
  "Fresher",
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5+ years",
] as const;

export type InterviewRole = (typeof INTERVIEW_ROLES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
