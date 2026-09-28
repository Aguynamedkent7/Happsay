import { INotesState } from "@/interfaces/interfaces";
import { cn } from "@/lib/utils";
import { TABS, type TabKey } from "@/lib/tabs";

type TasksHeaderProps = {
  title: string;
  summary: string;
  notes: INotesState | undefined;
  selectedTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
};

/** Date eyebrow, list title and summary, plus the mobile segmented tab control. */
export default function TasksHeader({ title, summary, notes, selectedTab, onSelectTab }: TasksHeaderProps) {
  return (
    <>
      <header className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1.5 md:gap-y-1">
        <p className="col-span-2 text-[13px] font-semibold tracking-[0.08em] text-eyebrow uppercase md:text-sm">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="font-display text-4xl leading-none font-extrabold tracking-[-0.03em] md:text-5xl">
          {title}
        </h1>
        <p className="text-sm text-muted md:text-base">{summary}</p>
      </header>

      <nav aria-label="Lists" className="grid grid-cols-3 gap-1 rounded-[14px] bg-sidebar p-1 md:hidden">
        {TABS.map(({ key, label }) => {
          const active = key === selectedTab;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectTab(key)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "h-10 rounded-[10px] text-[15px]",
                active ? "bg-primary font-semibold text-on-primary" : "text-fg-2",
              )}
            >
              {label} <span className={cn("ml-1", !active && "text-muted")}>{notes?.[key]?.length ?? 0}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
