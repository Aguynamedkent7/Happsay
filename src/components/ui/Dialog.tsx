import { useEffect, useRef, type KeyboardEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

type DialogProps = {
  onClose: () => void;
  /** id of the element that titles the dialog. */
  labelledBy: string;
  /** "responsive" is a bottom sheet below 900px and a centered dialog above. */
  variant?: "center" | "responsive";
  className?: string;
  children: ReactNode;
};

/**
 * Modal dialog: closes on Esc and backdrop click, traps Tab focus, moves focus in on open
 * and returns it to the trigger on close. Render it only while open.
 */
export function Dialog({ onClose, labelledBy, variant = "center", className, children }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Captured during the first render, before autoFocus moves focus into the dialog.
  const triggerRef = useRef(document.activeElement as HTMLElement | null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (panel && !panel.contains(document.activeElement)) {
      const preferred = panel.querySelector<HTMLElement>("[data-autofocus]");
      (preferred ?? panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel).focus();
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus?.();
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const sheet = variant === "responsive";

  return (
    <div
      className={cn(
        "hp-backdrop fixed inset-0 z-50 flex justify-center bg-overlay",
        sheet ? "items-end md:items-center md:p-4" : "items-center p-4",
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          "flex max-h-full flex-col overflow-y-auto bg-surface outline-none",
          sheet
            ? "hp-sheet w-full gap-[18px] rounded-t-3xl px-4 pt-2.5 pb-[calc(28px+env(safe-area-inset-bottom))] shadow-sheet " +
                "md:w-[560px] md:gap-[22px] md:rounded-[22px] md:p-7 md:shadow-dialog"
            : "w-full gap-[22px] rounded-[22px] p-7 shadow-dialog",
          className,
        )}
      >
        {sheet && <div aria-hidden="true" className="mx-auto h-[5px] w-10 shrink-0 rounded-full bg-input-border md:hidden" />}
        {children}
      </div>
    </div>
  );
}

type DialogHeaderProps = { id: string; title: string; onClose: () => void };

/** Title row with the 44×44 close button. */
export function DialogHeader({ id, title, onClose }: DialogHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 id={id} className="font-display text-2xl font-extrabold tracking-[-0.02em]">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sidebar text-fg-2 hover:text-fg"
      >
        <X size={18} />
      </button>
    </div>
  );
}
