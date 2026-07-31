import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/utils/constants";

/** Brand mark. Used in the sidebar, auth screens and the landing header. */
export function Logo({ className, showName = true }: { className?: string; showName?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="gradient-brand shadow-glow grid size-9 place-items-center rounded-xl">
        <Sparkles className="text-primary-foreground size-4.5" strokeWidth={2.4} />
      </span>
      {showName && <span className="text-lg font-extrabold tracking-tight">{APP_NAME}</span>}
    </span>
  );
}
