import { Archive, ListTodo, Square, SquareCheck, type LucideIcon } from "lucide-react";
import { INotesState } from "@/interfaces/interfaces";

export type TabKey = keyof INotesState;

type TabMeta = { key: TabKey; label: string; icon: LucideIcon; emptyIcon: LucideIcon };

/** The three task lists. Keys match the API/state shape; labels are what users see. */
export const TABS: TabMeta[] = [
  { key: "ToDo", label: "To do", icon: Square, emptyIcon: ListTodo },
  { key: "Done", label: "Done", icon: SquareCheck, emptyIcon: SquareCheck },
  { key: "Archive", label: "Archive", icon: Archive, emptyIcon: Archive },
];

export const LOGO_SRC = "/static/images/Happsay Logo.webp";
