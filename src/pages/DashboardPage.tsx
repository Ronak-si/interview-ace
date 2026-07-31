import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, ArrowRight, Award, Clock, Sparkles, Target, Trophy } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ListSkeleton, StatCardsSkeleton } from "@/components/common/Loaders";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { listInterviews, summarise } from "@/services/interviewService";
import { formatRelative, formatScore, scoreTone } from "@/utils/format";

/** Home screen: KPIs, score trend and recent activity. */
export default function DashboardPage() {
  const { profile, user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["interviews"],
    queryFn: listInterviews,
  });

  const stats = useMemo(() => summarise(data ?? []), [data]);
  const firstName = (profile?.full_name ?? user?.email ?? "there").split(/[\s@]/)[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's how your interview preparation is tracking."
        action={
          <Button asChild className="gap-1.5 rounded-xl">
            <Link to="/interview/new">
              <Sparkles className="size-4" />
              Start an interview
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <StatCardsSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total interviews"
            value={String(stats.total)}
            hint={`${stats.completed} completed`}
            icon={Target}
          />
          <StatCard
            label="Average score"
            value={stats.average === null ? "—" : `${stats.average}`}
            hint="Across completed rounds"
            icon={Activity}
            accent="chart-2"
          />
          <StatCard
            label="Best score"
            value={stats.best === null ? "—" : `${stats.best}`}
            hint="Personal record"
            icon={Trophy}
            accent="success"
          />
          <StatCard
            label="Practice time"
            value={`${stats.practiceMinutes}m`}
            hint="Total time in mock rounds"
            icon={Clock}
            accent="warning"
          />
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Progress chart */}
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold">Score progress</h2>
              <p className="text-muted-foreground text-xs">Overall score per completed interview</p>
            </div>
            <Badge variant="secondary" className="rounded-lg">
              {stats.trend.length} rounds
            </Badge>
          </div>

          {isLoading ? (
            <ListSkeleton rows={3} />
          ) : stats.trend.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No score history yet"
              description="Finish your first mock interview and your progress curve will appear here."
            />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trend} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="var(--color-muted-foreground)"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="var(--color-muted-foreground)"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      color: "var(--color-popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.5}
                    fill="url(#scoreFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Skill split */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-base font-bold">Skill breakdown</h2>
          <p className="text-muted-foreground text-xs">Averages from your evaluated answers</p>

          <div className="mt-5 space-y-5">
            {[
              ["Technical", averageOf(data, "technical_score")],
              ["Communication", averageOf(data, "communication_score")],
              ["Problem solving", averageOf(data, "problem_solving_score")],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {value === null ? "—" : `${value}/100`}
                  </span>
                </div>
                <Progress value={Number(value ?? 0)} className="h-2" />
              </div>
            ))}
          </div>

          <div className="border-border/70 mt-6 border-t pt-5">
            <p className="text-muted-foreground text-xs">
              {profile?.target_role
                ? `Target role: ${profile.target_role}`
                : "Set a target role in your profile."}
            </p>
          </div>
        </div>
      </section>

      {/* Recent activity */}
      <section className="glass-card rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold">Recent activity</h2>
            <p className="text-muted-foreground text-xs">Your latest mock interviews</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 rounded-xl">
            <Link to="/analytics">
              View all <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <p className="text-destructive text-sm">
            We couldn't load your interviews. Please refresh the page.
          </p>
        ) : (data?.length ?? 0) === 0 ? (
          <EmptyState
            icon={Award}
            title="No interviews yet"
            description="Generate your first AI interview and start building a track record."
            action={
              <Button asChild className="rounded-xl">
                <Link to="/interview/new">Create an interview</Link>
              </Button>
            }
          />
        ) : (
          <ul className="space-y-2.5">
            {(data ?? []).slice(0, 5).map((interview) => (
              <li key={interview.id}>
                <div className="border-border/70 bg-card/50 transition-smooth grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-3.5 hover:-translate-y-0.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {interview.role} · {interview.difficulty}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {interview.question_count} questions · {formatRelative(interview.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {interview.status === "completed" ? (
                      <Badge
                        variant="outline"
                        className={`rounded-lg border-${scoreTone(interview.overall_score)}/40 text-${scoreTone(interview.overall_score)}`}
                      >
                        {formatScore(interview.overall_score)}/100
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-lg">
                        In progress
                      </Badge>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/** Average of a numeric column across completed interviews. */
function averageOf(
  interviews: Awaited<ReturnType<typeof listInterviews>> | undefined,
  key: "technical_score" | "communication_score" | "problem_solving_score",
): number | null {
  const values = (interviews ?? [])
    .map((i) => i[key])
    .filter((v): v is number => v !== null && v !== undefined);
  if (!values.length) return null;
  return Math.round(values.reduce((a, b) => a + Number(b), 0) / values.length);
}
