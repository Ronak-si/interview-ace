import { createFileRoute } from "@tanstack/react-router";
import SignupPage from "@/pages/auth/SignupPage";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — PrepAI" },
      {
        name: "description",
        content: "Create a free PrepAI account and run your first AI mock interview today.",
      },
      { property: "og:title", content: "Create your account — PrepAI" },
      { property: "og:description", content: "Start running AI mock interviews in under a minute." },
    ],
  }),
  component: SignupPage,
});
