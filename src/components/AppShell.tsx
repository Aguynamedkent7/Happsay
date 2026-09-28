import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { LOGO_SRC, TABS, type TabKey } from "@/lib/tabs";
import { useFetchTodos } from "@/hooks/tanstack/notes/useQueryNote";
import { useGetUser } from "@/hooks/tanstack/getuser/useQueryGetUser";
import { useLogout as logout } from "@/services/auth/authApi";
import showToast from "@/components/ui/showToast";
import ThemeToggle from "@/components/ThemeToggle";

type AvatarProps = { name: string; className?: string };

/** Yellow circle with the user's initial. */
export function Avatar({ name, className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-yellow font-bold text-ink",
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

type AppShellProps = {
  page: "tasks" | "settings";
  activeTab?: TabKey;
  /** Omitted on Settings, where picking a list navigates back to it. */
  onSelectTab?: (tab: TabKey) => void;
  className?: string;
  children: ReactNode;
};

/** Sidebar + main area on desktop; a top bar on mobile. */
export default function AppShell({ page, activeTab, onSelectTab, className, children }: AppShellProps) {
  const navigate = useNavigate();
  const { data: notes } = useFetchTodos();
  const { data: user } = useGetUser(Number(localStorage.getItem("userId")));
  const username: string = user?.username ?? localStorage.getItem("username") ?? "";
  const onSettings = page === "settings";

  const selectTab = (tab: TabKey) =>
    onSelectTab ? onSelectTab(tab) : navigate("/", { state: { tab } });

  const handleLogout = () =>
    logout(navigate).catch(() => showToast("Couldn't log out. Please try again.", "logout_err"));

  const wordmark = "font-display font-extrabold tracking-[-0.02em]";

  return (
    <div className="flex min-h-dvh flex-col md:h-dvh md:flex-row">
      <aside className="hidden w-[264px] shrink-0 flex-col gap-9 border-r border-sidebar-border bg-sidebar px-5 py-7 md:flex">
        <div className="flex items-center gap-3 px-2">
          <img src={LOGO_SRC} alt="" className="size-10 rounded-full" />
          <span className={cn(wordmark, "text-[26px]")}>Happsay</span>
          <ThemeToggle className="ml-auto" />
        </div>

        <nav aria-label="Lists" className="flex flex-col gap-1">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = key === activeTab;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectTab(key)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-[46px] items-center gap-3 rounded-xl px-3.5 text-base transition-colors",
                  active ? "bg-primary font-semibold text-on-primary" : "font-medium text-fg-2 hover:bg-surface/60",
                )}
              >
                <Icon size={20} strokeWidth={2} aria-hidden="true" />
                {label}
                <span className={cn("ml-auto text-sm", active ? "font-bold" : "text-muted")}>
                  {notes?.[key]?.length ?? 0}
                </span>
              </button>
            );
          })}
        </nav>

        <div
          className={cn(
            "mt-auto flex items-center gap-3 rounded-[14px] border bg-bg p-3",
            onSettings ? "border-primary" : "border-sidebar-border",
          )}
        >
          <Avatar name={username} className="size-9 text-[15px]" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[15px] font-semibold">{username}</span>
            <Link
              to="/settings"
              aria-current={onSettings ? "page" : undefined}
              className={cn(
                "w-fit text-[13px] hover:text-primary-hover",
                onSettings ? "font-semibold text-primary" : "text-muted",
              )}
            >
              Settings
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-fg-2 hover:bg-surface"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border bg-sidebar pr-3 pl-4 md:hidden">
        {onSettings ? (
          <>
            <Link to="/" className="mr-auto flex h-11 items-center gap-1 text-[15px] font-semibold text-primary">
              <ChevronLeft size={18} aria-hidden="true" />
              Back to tasks
            </Link>
            <ThemeToggle />
          </>
        ) : (
          <>
            <img src={LOGO_SRC} alt="" className="size-8 rounded-full" />
            <span className={cn(wordmark, "grow text-[22px]")}>Happsay</span>
            <ThemeToggle />
            <Link to="/settings" aria-label="Account and settings" className="flex size-11 items-center justify-center rounded-full">
              <Avatar name={username} className="size-[34px] text-[15px]" />
            </Link>
          </>
        )}
      </header>

      <main
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-[18px] px-4 pt-[22px] pb-6 md:gap-8 md:overflow-y-auto md:px-14 md:py-11",
          className,
        )}
      >
        {children}
      </main>
    </div>
  );
}
