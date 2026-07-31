import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — PrepAI" },
      { name: "description", content: "Request a password recovery link for your PrepAI account." },
      { property: "og:title", content: "Reset your password — PrepAI" },
      { property: "og:description", content: "Request a password recovery link." },
    ],
  }),
  component: ForgotPasswordPage,
});
