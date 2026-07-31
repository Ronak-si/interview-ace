import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";

/**
 * Split-screen shell for login / signup / password screens.
 * Left: brand panel. Right: the form.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <aside className="gradient-brand relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="bg-background/10 absolute -top-24 -left-24 size-[420px] rounded-full blur-3xl" />
        <div className="bg-background/10 absolute right-0 -bottom-32 size-[380px] rounded-full blur-3xl" />
        <div className="text-primary-foreground relative">
          <Logo />
        </div>
        <div className="text-primary-foreground relative max-w-md">
          <h2 className="text-4xl leading-tight font-extrabold">
            Practise the interview before it happens.
          </h2>
          <p className="mt-4 text-sm opacity-85">
            AI-generated question sets, timed mock rounds and per-answer feedback across technical
            depth, communication and problem solving.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4">
            {[
              ["4", "Role tracks"],
              ["3", "Difficulty tiers"],
              ["∞", "Mock rounds"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="text-2xl font-extrabold">{value}</dt>
                <dd className="text-xs opacity-80">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="text-primary-foreground relative text-xs opacity-70">
          Built for placement prep at product companies.
        </p>
      </aside>

      {/* Form panel */}
      <main className="mesh-bg relative flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="lg:invisible">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="animate-rise w-full max-w-md py-10">
            <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer && <div className="text-muted-foreground mt-6 text-sm">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
