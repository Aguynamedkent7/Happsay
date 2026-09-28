import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "happsay-theme";
const listeners = new Set<() => void>();
let current: Theme | null = null;

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch (error) {
    console.warn("Theme preference unavailable:", error);
    return null;
  }
}

/** The active theme: the saved choice, else the system preference. */
export function getTheme(): Theme {
  if (current) return current;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return readStored() ?? (systemDark ? "dark" : "light");
}

/** Saves the theme, applies the `dark` class on <html> and notifies subscribers. */
export function setTheme(theme: Theme): void {
  current = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn("Could not save theme preference:", error);
  }
  document.documentElement.classList.toggle("dark", theme === "dark");
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** React hook returning the active theme; re-renders when it changes. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme);
}
