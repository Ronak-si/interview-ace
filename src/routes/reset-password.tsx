import { createFileRoute } from "@tanstack/react-router";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a new password — PrepAI" },
      { name: "description", content: "Set a new password for your PrepAI account." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Choose a new password — PrepAI" },
      { property: "og:description", content: "Set a new password for your PrepAI account." },
    ],
  }),
  component: ResetPasswordPage,
});
