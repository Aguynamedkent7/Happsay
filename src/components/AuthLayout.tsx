import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LOGO_SRC } from "@/lib/tabs";
import ThemeToggle from "@/components/ThemeToggle";
import Toast from "@/components/ui/ToastContainer";

type Shape = {
  /** Outer box: position and size. Mobile first; `md:` is the desktop panel. */
  box: { login: string; signup: string; desktop: string };
  look: string;
  idle: string;
  dur: string;
  delay: string;
};

const SHAPES: Shape[] = [
  {
    box: {
      login: "right-[-90px] top-[-100px] size-[250px]",
      signup: "right-[-90px] top-[-120px] size-[250px]",
      desktop: "md:right-[-120px] md:top-[-140px] md:size-[460px]",
    },
    look: "rounded-full bg-orange",
    idle: "hp-drift", dur: "14s", delay: "0.05s",
  },
  {
    box: {
      login: "right-[60px] top-[150px] size-[70px]",
      signup: "right-[70px] top-[110px] size-[60px]",
      desktop: "md:right-[150px] md:top-[250px] md:size-[150px]",
    },
    look: "rounded-full bg-yellow",
    idle: "hp-bob", dur: "7s", delay: "0.25s",
  },
  {
    box: {
      login: "left-[230px] bottom-[-110px] h-[260px] w-[150px] [--r:75px]",
      signup: "left-[240px] bottom-[-130px] h-[240px] w-[140px] [--r:70px]",
      desktop: "md:left-[440px] md:bottom-[-200px] md:h-[520px] md:w-[300px] md:[--r:150px] origin-bottom",
    },
    look: "rounded-t-[var(--r)] bg-sky",
    idle: "hp-rise", dur: "11s", delay: "0.4s",
  },
  {
    box: {
      login: "right-[-40px] bottom-[30px] size-[100px] [--b:13px]",
      signup: "right-[-40px] bottom-[10px] size-[90px] [--b:12px]",
      desktop: "md:right-[-60px] md:bottom-[120px] md:size-[190px] md:[--b:22px]",
    },
    look: "box-border rounded-full border-[length:var(--b)] border-cream bg-transparent",
    idle: "hp-spin", dur: "18s", delay: "0.55s",
  },
  {
    box: {
      login: "left-[250px] bottom-[30px] size-[36px]",
      signup: "left-[262px] bottom-[26px] size-[32px]",
      desktop: "md:left-[340px] md:bottom-[360px] md:size-[72px]",
    },
    look: "rounded-full bg-orange",
    idle: "hp-bounce", dur: "5s", delay: "0.75s",
  },
];

type AuthLayoutProps = {
  /** Picks the mobile hero size: the tall login band or the shorter sign-up one. */
  variant?: "login" | "signup";
  title: string;
  subtitle?: string;
  children: ReactNode;
};

/** Split auth layout: animated teal panel (a hero band on mobile) beside the form. */
export default function AuthLayout({ variant = "login", title, subtitle, children }: AuthLayoutProps) {
  const signup = variant === "signup";

  return (
    <div className="flex min-h-dvh flex-col bg-bg md:flex-row">
      <section
        className={cn(
          "hp-shapes relative flex shrink-0 flex-col justify-between overflow-hidden rounded-b-[28px] bg-auth-panel",
          "pt-4 pr-4 pl-6 md:h-auto md:w-[min(680px,47%)] md:rounded-none md:p-14",
          signup ? "h-[220px] pb-6" : "h-[300px] pb-7",
        )}
      >
        {SHAPES.map((shape) => (
          <div
            key={shape.idle}
            aria-hidden="true"
            className={cn("hp-shape absolute", signup ? shape.box.signup : shape.box.login, shape.box.desktop)}
            style={{ "--idle": shape.idle, "--dur": shape.dur, "--delay": shape.delay } as CSSProperties}
          >
            <div className={shape.look} />
          </div>
        ))}

        <div className="relative flex items-center gap-3">
          <img
            src={LOGO_SRC}
            alt=""
            className="size-9 rounded-full border-2 border-cream md:size-12 md:border-[3px]"
          />
          <span className="grow font-display text-[22px] font-extrabold tracking-[-0.02em] text-cream md:text-[28px]">
            Happsay
          </span>
          <ThemeToggle tone="hero" className="md:hidden" />
        </div>

        <div className="relative flex max-w-[200px] flex-col gap-[18px] md:w-[340px] md:max-w-none">
          <h2
            className={cn(
              "font-display leading-[0.95] font-extrabold tracking-[-0.04em] text-cream md:text-[76px]",
              signup ? "text-[40px]" : "text-[46px]",
            )}
          >
            Plan your life.
          </h2>
          <p className="hidden text-lg leading-normal text-subline md:block">
            Tasks, deadlines, and a clean slate once they're done.
          </p>
        </div>
      </section>

      <div className="relative flex flex-1 justify-center md:items-center">
        <ThemeToggle className="absolute top-8 right-10 hidden md:inline-flex" />
        <div
          className={cn(
            "flex w-full flex-col px-4 md:w-[400px] md:gap-7 md:px-0 md:py-10",
            signup ? "gap-5 pt-6 pb-5" : "gap-[22px] pt-7 pb-6",
          )}
        >
          <div className="flex flex-col gap-2">
            <h1
              className={cn(
                "font-display font-extrabold tracking-[-0.03em] md:text-[40px]",
                signup ? "text-[28px]" : "text-[30px]",
              )}
            >
              {title}
            </h1>
            {subtitle && <p className="text-[15px] text-muted md:text-base">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
      <Toast />
    </div>
  );
}
