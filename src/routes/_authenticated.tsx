import { useEffect } from "react";
import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";

import { AppLayout } from "@/layouts/AppLayout";
import { FullPageLoader } from "@/components/common/Loaders";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

/** Client-side gate: everything below this route requires a session. */
function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/login", search: { redirect: pathname }, replace: true });
    }
  }, [loading, user, navigate, pathname]);

  if (loading || !user) return <FullPageLoader />;

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
