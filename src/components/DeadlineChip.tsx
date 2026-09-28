import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { localDateOffset, parseLocalDate } from "@/lib/date";

type DeadlineChipProps = { deadline: string; className?: string };

/** Colored deadline pill: Overdue / Today / Tomorrow / weekday, compared as local dates. */
export default function DeadlineChip({ deadline, className }: DeadlineChipProps) {
  if (!deadline) return null;

  const today = localDateOffset(0);
  const date = parseLocalDate(deadline);
  const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  let label: string;
  let tone: string;
  if (deadline < today) {
    label = "Overdue";
    tone = "bg-chip-overdue-bg text-chip-overdue-fg";
  } else if (deadline === today) {
    label = "Today";
    tone = "bg-chip-soon-bg text-chip-soon-fg";
  } else if (deadline === localDateOffset(1)) {
    label = "Tomorrow";
    tone = "bg-chip-soon-bg text-chip-soon-fg";
  } else {
    label = date.toLocaleDateString("en-US", { weekday: "short" });
    tone = "bg-chip-later-bg text-chip-later-fg";
  }
  const Icon = deadline < today ? Clock : CalendarDays;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-[5px] text-[13px] leading-none font-bold",
        tone,
        className,
      )}
    >
      <Icon size={14} strokeWidth={2} aria-hidden="true" />
      {label} · {monthDay}
    </span>
  );
}
