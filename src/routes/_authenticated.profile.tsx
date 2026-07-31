import { createFileRoute } from "@tanstack/react-router";
import ProfilePage from "@/pages/ProfilePage";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — PrepAI" },
      { name: "description", content: "Manage your PrepAI account, target role and password." },
      { property: "og:title", content: "Profile — PrepAI" },
      { property: "og:description", content: "Manage your account details and security." },
    ],
  }),
  component: ProfilePage,
});
