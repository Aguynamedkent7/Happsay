import { ITodoQuery } from "@/interfaces/interfaces";
import { cn } from "@/lib/utils";
import DeadlineChip from "@/components/DeadlineChip";

type TaskCardProps = {
  note: ITodoQuery;
  /** Archived tasks have no checkbox (as before). */
  showCheckbox: boolean;
  onToggle: () => void;
  onOpen: () => void;
};

/** A task: grid card on desktop, a list row on mobile. */
export default function TaskCard({ note, showCheckbox, onToggle, onOpen }: TaskCardProps) {
  const done = note.is_done;

  return (
    <article
      className={cn(
        "flex flex-col gap-3.5 rounded-2xl border bg-surface p-4 transition duration-150",
        "hover:-translate-y-px hover:border-input-border md:min-h-[150px] md:rounded-[18px] md:p-5",
      )}
    >
      <div className="flex items-start gap-3">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={done}
            onChange={onToggle}
            aria-label={`Mark ${note.title} as ${done ? "not done" : "done"}`}
            className="mt-px size-[22px] shrink-0 accent-primary"
          />
        )}
        <div className="relative flex min-w-0 flex-1 flex-col gap-2 md:gap-1.5">
          <h2 className={cn("text-[17px] leading-[1.3] font-bold md:text-lg", done && "line-through opacity-70")}>
            {/* The ::after overlay makes the whole text block open the task. */}
            <button
              type="button"
              onClick={onOpen}
              className="text-left after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-primary"
            >
              {note.title}
            </button>
          </h2>
          <p className={cn("line-clamp-2 text-[15px] leading-[1.45] break-words text-muted md:leading-normal", done && "opacity-70")}>
            {note.content}
          </p>
          <DeadlineChip deadline={note.deadline} className="md:hidden" />
        </div>
      </div>
      <DeadlineChip deadline={note.deadline} className="mt-auto hidden md:inline-flex" />
    </article>
  );
}
