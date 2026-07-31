import { createFileRoute } from "@tanstack/react-router";
import LoginPage from "@/pages/auth/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — PrepAI" },
      { name: "description", content: "Sign in to your PrepAI account to continue practising." },
      { property: "og:title", content: "Sign in — PrepAI" },
      { property: "og:description", content: "Sign in to continue your interview preparation." },
    ],
  }),
  component: LoginPage,
});
