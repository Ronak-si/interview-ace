import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/pages/DashboardPage";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — PrepAI" },
      {
        name: "description",
        content: "Track your mock interview scores, practice time and recent activity.",
      },
      { property: "og:title", content: "Dashboard — PrepAI" },
      { property: "og:description", content: "Your interview preparation at a glance." },
    ],
  }),
  component: DashboardPage,
});
