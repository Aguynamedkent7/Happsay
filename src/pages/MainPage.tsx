import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { ITodoQuery } from "@/interfaces/interfaces";
import { useFetchTodos } from "@/hooks/tanstack/notes/useQueryNote";
import useMutationNote from "@/hooks/tanstack/notes/useMutationNote";
import Toast from "@/components/ui/ToastContainer";
import { toast } from "react-toastify";
import showToast from "@/components/ui/showToast";
import { cn } from "@/lib/utils";
import { localDateString } from "@/lib/date";
import { TABS, type TabKey } from "@/lib/tabs";
import AppShell from "@/components/AppShell";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import AddTaskForm from "@/components/tasks/AddTaskForm";
import TaskCard from "@/components/tasks/TaskCard";
import TaskDialog from "@/components/tasks/TaskDialog";
import ConfirmDialog from "@/components/tasks/ConfirmDialog";
import TasksHeader from "@/components/tasks/TasksHeader";

export default function MainPage() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<TabKey>(
    (location.state as { tab?: TabKey } | null)?.tab ?? "ToDo",
  );
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<ITodoQuery | null>(null);
  const [noteDeadline, setNoteDeadline] = useState("");
  const [noteToDelete, setNoteToDelete] = useState<ITodoQuery | null>(null);
  const [noteToArchive, setNoteToArchive] = useState<ITodoQuery | null>(null);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  const { data: notes } = useFetchTodos();

  const { useMutationUpdateNoteTitle } = useMutationNote();
  const { mutate: updateNoteTitle } = useMutationUpdateNoteTitle();

  const { useMutationUpdateNoteContent } = useMutationNote();
  const { mutate: updateNoteContent } = useMutationUpdateNoteContent();

  const { useMutationUpdateNoteDeadline } = useMutationNote();
  const { mutate: updateNoteDeadline } = useMutationUpdateNoteDeadline();

  const { useMutationAddNote } = useMutationNote();
  const { mutate: addNote } = useMutationAddNote();

  const { useMutationDeleteNote } = useMutationNote();
  const { mutate: deleteNote } = useMutationDeleteNote();

  const { useMutationToggleComplete } = useMutationNote();
  const { mutate: toggleComplete } = useMutationToggleComplete();

  const { useMutationToggleArchive } = useMutationNote();
  const { mutate: toggleArchive } = useMutationToggleArchive();

  const handleAddNote = async () => {
    if (selectedTab !== "ToDo") return;

    if (!noteTitle.trim() || !noteContent.trim() || !noteDeadline) {
      showToast("Please fill in all input fields", "missing_fields");
      return;
    }

    addNote({ title: noteTitle, content: noteContent, deadline: noteDeadline });

    // Reset input fields
    setNoteTitle("");
    setNoteContent("");
    setNoteDeadline("");
    setIsAddSheetOpen(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedNote) return;

    try {
      updateNoteTitle({ id: selectedNote.id, newTitle: selectedNote.title });
      updateNoteContent({ id: selectedNote.id, newContent: selectedNote.content });
      updateNoteDeadline({ id: selectedNote.id, newDeadline: selectedNote.deadline });
      toast.success("Changes saved");
      setSelectedNote(null); // Close the popup
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteNote = async (id: number) => {
    deleteNote(id);
  };

  const confirmDeleteNote = (note: ITodoQuery) => {
    setNoteToDelete(note);
  };

  const handleDeleteConfirmed = async () => {
    if (noteToDelete) {
      await handleDeleteNote(noteToDelete.id);
      setSelectedNote(null); // Close the note popup
    }
    setNoteToDelete(null); // Close the delete confirmation popup
  };

  const handleToggleComplete = (id: number, is_done: boolean) => {
    toggleComplete({ id, is_done });

    // Close the popup if the toggled note was open
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const handleToggleArchive = async (id: number, is_archived: boolean) => {
    toggleArchive({ id, is_archived });
    setSelectedNote(null);
  };

  const confirmArchiveNote = (note: ITodoQuery) => {
    setNoteToArchive(note);
  };

  const handleArchiveConfirmed = async () => {
    if (noteToArchive) {
      await handleToggleArchive(noteToArchive.id, noteToArchive.is_archived);
    }
    setNoteToArchive(null); // Close the archive confirmation popup
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = localDateString();

    if (selectedDate < today) {
      showToast("Can't set a past date as a deadline", "error");
      return; // Prevents updating the state
    }

    setNoteDeadline(selectedDate);
  };

  const handlePopupNoteDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = localDateString();

    if (selectedDate < today) {
      showToast("Can't set a past date as deadline", "error");
      setSelectedNote((prev) => (prev ? { ...prev, deadline: today } : prev));
      // Reset to today's date or keep the last valid date
    } else if (selectedNote) {
      setSelectedNote((prev) => (prev ? { ...prev, deadline: selectedDate } : prev));
    }
  };

  const isPastDue = (deadline: string) => {
    const today = localDateString();
    return deadline < today;
  };

  const selectTab = (tab: TabKey) => {
    setSelectedTab(tab);
    setSelectedNote(null);
  };

  const today = localDateString();
  const tab = TABS.find((t) => t.key === selectedTab) ?? TABS[0];
  const list = (notes?.[selectedTab] ?? []).slice().sort((a, b) => a.id - b.id);
  const overdue = (notes?.ToDo ?? []).filter((n) => isPastDue(n.deadline)).length;
  const summary =
    selectedTab === "ToDo"
      ? `${list.length} open${overdue ? ` · ${overdue} overdue` : ""}`
      : selectedTab === "Done"
        ? `${list.length} completed`
        : `${list.length} archived`;
  const emptyMessage =
    selectedTab === "Done"
      ? "No completed tasks yet. Keep going!"
      : selectedTab === "Archive"
        ? "No archived notes. Archive a note to store it here."
        : "It's quiet around here... Start planning your life now!";
  const EmptyIcon = tab.emptyIcon;

  const addFormProps = {
    title: noteTitle,
    content: noteContent,
    deadline: noteDeadline,
    minDate: today,
    onTitleChange: setNoteTitle,
    onContentChange: setNoteContent,
    onDeadlineChange: handleDeadlineChange,
    onSubmit: handleAddNote,
  };

  return (
    <AppShell page="tasks" activeTab={selectedTab} onSelectTab={selectTab}>
      <TasksHeader
        title={tab.label}
        summary={summary}
        notes={notes}
        selectedTab={selectedTab}
        onSelectTab={selectTab}
      />

      {selectedTab === "ToDo" && <AddTaskForm layout="inline" className="hidden md:flex" {...addFormProps} />}

      {list.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
          <EmptyIcon size={48} strokeWidth={1.75} className="text-input-border" aria-hidden="true" />
          <p className="max-w-xs text-base text-muted">{emptyMessage}</p>
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 min-[1100px]:grid-cols-3",
            selectedTab === "ToDo" && "pb-24 md:pb-0",
          )}
        >
          {list.map((note) => (
            <TaskCard
              key={note.id}
              note={note}
              showCheckbox={selectedTab !== "Archive"}
              onToggle={() => handleToggleComplete(note.id, note.is_done)}
              onOpen={() => setSelectedNote(note)}
            />
          ))}
        </div>
      )}

      {selectedTab === "ToDo" && (
        <button
          type="button"
          onClick={() => setIsAddSheetOpen(true)}
          aria-label="Add task"
          className="fixed right-4 bottom-[calc(24px+env(safe-area-inset-bottom))] z-20 flex size-[60px] items-center justify-center rounded-[20px] bg-primary text-on-primary shadow-fab md:hidden"
        >
          <Plus size={26} strokeWidth={2.25} />
        </button>
      )}

      {isAddSheetOpen && (
        <Dialog onClose={() => setIsAddSheetOpen(false)} labelledBy="new-task-title" variant="responsive">
          <DialogHeader id="new-task-title" title="New task" onClose={() => setIsAddSheetOpen(false)} />
          <AddTaskForm layout="sheet" {...addFormProps} />
        </Dialog>
      )}

      {selectedNote && (
        <TaskDialog
          note={selectedNote}
          archiveLabel={selectedTab === "Archive" ? "Unarchive" : "Archive"}
          minDate={today}
          onChange={(patch) => setSelectedNote((prev) => (prev ? { ...prev, ...patch } : prev))}
          onDeadlineChange={handlePopupNoteDeadlineChange}
          onClose={() => setSelectedNote(null)}
          onSave={handleSaveChanges}
          onDelete={() => confirmDeleteNote(selectedNote)}
          onArchive={() =>
            !selectedNote.is_archived
              ? confirmArchiveNote(selectedNote)
              : handleToggleArchive(selectedNote.id, selectedNote.is_archived)
          }
        />
      )}
      {noteToDelete && (
        <ConfirmDialog
          title="Delete this task?"
          body="This can't be undone."
          confirmLabel="Yes, delete"
          tone="danger"
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setNoteToDelete(null)}
        />
      )}
      {noteToArchive && (
        <ConfirmDialog
          title="Archive this task?"
          body="You can find it later in Archive."
          confirmLabel="Yes, archive"
          tone="primary"
          onConfirm={handleArchiveConfirmed}
          onCancel={() => setNoteToArchive(null)}
        />
      )}
      <Toast />
    </AppShell>
  );
}
