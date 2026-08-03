import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { FullPageLoader } from "@/components/common/Loaders";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [
      { title: "Finishing sign in — PrepAI" },
      { name: "description", content: "Completing your secure PrepAI sign in." },
      { property: "og:title", content: "Finishing sign in — PrepAI" },
      { property: "og:description", content: "Completing your secure PrepAI sign in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OAuthCallbackPage,
});

function OAuthCallbackPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    void navigate({ to: user ? "/dashboard" : "/login", replace: true });
  }, [loading, navigate, user]);

  return <FullPageLoader label="Finishing Google sign-in…" />;
}