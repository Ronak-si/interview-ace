import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Target, TrendingUp, Trophy } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listInterviews, summarise } from "@/services/interviewService";

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — PrepAI" },
      { name: "description", content: "Score trends and topic-wise strengths across your rounds." },
      { property: "og:title", content: "Analytics — PrepAI" },
      { property: "og:description", content: "Score trends across your mock interviews." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

const AXIS = { stroke: "hsl(var(--muted-foreground))", fontSize: 12 };

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-xl px-3 py-2 text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="font-semibold">
          {entry.name}: {Math.round(entry.value)}
        </p>
      ))}
    </div>
  );
}

function AnalyticsPage() {
  const { data: interviews, isLoading } = useQuery({
    queryKey: ["interviews"],
    queryFn: listInterviews,
  });

  const stats = useMemo(() => summarise(interviews ?? []), [interviews]);

  const completed = useMemo(
    () => (interviews ?? []).filter((i) => i.status === "completed" && i.overall_score !== null),
    [interviews],
  );

  const skills = useMemo(() => {
    if (!completed.length) return [];
    const avg = (key: "technical_score" | "communication_score" | "problem_solving_score") =>
      Math.round(
        completed.reduce((acc, i) => acc + Number(i[key] ?? 0), 0) / completed.length,
      );
    return [
      { skill: "Technical", score: avg("technical_score") },
      { skill: "Communication", score: avg("communication_score") },
      { skill: "Problem solving", score: avg("problem_solving_score") },
    ];
  }, [completed]);

  const byRole = useMemo(() => {
    const map = new Map<string, { role: string; total: number; count: number }>();
    for (const i of completed) {
      const entry = map.get(i.role) ?? { role: i.role, total: 0, count: 0 };
      entry.total += Number(i.overall_score ?? 0);
      entry.count += 1;
      map.set(i.role, entry);
    }
    return [...map.values()].map((e) => ({ role: e.role, score: Math.round(e.total / e.count) }));
  }, [completed]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Analytics" description="Deep dive into your interview performance." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (!completed.length) {
    return (
      <div className="space-y-8">
        <PageHeader title="Analytics" description="Deep dive into your interview performance." />
        <EmptyState
          icon={BarChart3}
          title="No completed interviews yet"
          description="Finish a mock interview and your score trends, skill radar and role breakdown will appear here."
          action={
            <Button asChild>
              <Link to="/interview/new">Start an interview</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" description="Deep dive into your interview performance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BarChart3} label="Completed rounds" value={String(stats.completed)} />
        <StatCard icon={TrendingUp} label="Average score" value={`${stats.average ?? 0}`} />
        <StatCard icon={Trophy} label="Best score" value={`${stats.best ?? 0}`} />
        <StatCard icon={Target} label="Practice time" value={`${stats.practiceMinutes}m`} />
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-base">Score trend</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.trend} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="analyticsScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} {...AXIS} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} {...AXIS} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="score"
                name="Score"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#analyticsScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Skill radar</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skills} outerRadius="72%">
                <PolarGrid opacity={0.25} />
                <PolarAngleAxis dataKey="skill" {...AXIS} />
                <Radar
                  dataKey="score"
                  name="Average"
                  stroke="var(--color-primary)"
                  fill="var(--color-primary)"
                  fillOpacity={0.35}
                />
                <Tooltip content={<ChartTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Average score by role</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byRole} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="role" tickLine={false} axisLine={false} {...AXIS} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} {...AXIS} />
                <Tooltip content={<ChartTooltip />} cursor={{ opacity: 0.08 }} />
                <Bar dataKey="score" name="Score" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
