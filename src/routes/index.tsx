import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Brain, Gauge, MessagesSquare, Timer } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrepAI — AI Interview Preparation for Developers" },
      {
        name: "description",
        content:
          "Run AI-generated mock interviews for frontend, backend, full stack and SDE roles. Timed rounds, per-answer feedback and progress analytics.",
      },
      { property: "og:title", content: "PrepAI — AI Interview Preparation for Developers" },
      {
        property: "og:description",
        content:
          "AI mock interviews with scoring across technical depth, communication and problem solving.",
      },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    icon: Brain,
    title: "AI question sets",
    body: "Role and difficulty aware question generation across four engineering tracks.",
  },
  {
    icon: Timer,
    title: "Timed mock rounds",
    body: "One question at a time, a live timer and answers auto-saved as you type.",
  },
  {
    icon: MessagesSquare,
    title: "Per-answer feedback",
    body: "Detailed critique, an ideal answer and concrete suggestions for every response.",
  },
  {
    icon: Gauge,
    title: "Four-way scoring",
    body: "Overall, technical, communication and problem-solving scores on every round.",
  },
  {
    icon: BarChart3,
    title: "Progress analytics",
    body: "Trend lines, topic-wise strength and your personal best across all attempts.",
  },
];

function LandingPage() {
  return (
    <div className="mesh-bg min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="rounded-xl">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild className="rounded-xl">
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-12 pb-24">
        <section className="animate-rise max-w-3xl">
          <span className="border-border/70 bg-card/50 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
            <span className="bg-success size-1.5 rounded-full" />
            Built for placement season
          </span>
          <h1 className="mt-6 text-5xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
            Practise the interview <span className="gradient-text">before it happens</span>.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg">
            PrepAI generates realistic interview rounds for frontend, backend, full stack and SDE
            roles, then scores every answer so you know exactly what to fix next.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-1.5 rounded-xl">
              <Link to="/signup">
                Start practising <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl">
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="glass-card transition-smooth rounded-2xl p-5 hover:-translate-y-1">
              <span className="bg-primary/12 text-primary grid size-10 place-items-center rounded-xl">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-bold">{title}</h2>
              <p className="text-muted-foreground mt-1.5 text-sm">{body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
