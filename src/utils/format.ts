/** Small pure helpers used across pages. Easy to unit-test and explain. */

/** "12 Mar 2025" */
export function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** "3 days ago" style relative label. */
export function formatRelative(value?: string | null): string {
  if (!value) return "—";
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

/** Seconds -> "07:35" */
export function formatDuration(totalSeconds = 0): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Rounds a 0-100 score for display. */
export function formatScore(score?: number | null): string {
  if (score === null || score === undefined) return "—";
  return `${Math.round(Number(score))}`;
}

/** Semantic token name for a score badge. */
export function scoreTone(score?: number | null): "success" | "warning" | "destructive" {
  const n = Number(score ?? 0);
  if (n >= 75) return "success";
  if (n >= 50) return "warning";
  return "destructive";
}

/** "Ashish Kumar" -> "AK" */
export function initials(name?: string | null): string {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
