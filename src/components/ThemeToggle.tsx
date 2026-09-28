import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { setTheme, useTheme } from "@/lib/theme";

type ThemeToggleProps = {
  /** "hero" is the cream-on-teal style used on the mobile auth band. */
  tone?: "default" | "hero";
  className?: string;
};

export default function ThemeToggle({ tone = "default", className }: ThemeToggleProps) {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const label = `Switch to ${next} mode`;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-xl border",
        tone === "hero"
          ? "border-cream/40 bg-[rgba(15,94,89,.6)] text-cream"
          : "border-input-border text-fg-2 hover:bg-surface",
        className,
      )}
    >
      {theme === "dark" ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
    </button>
  );
}
