import type { ChangeEvent, FormEvent } from "react";
import { Archive, Trash2 } from "lucide-react";
import { ITodoQuery } from "@/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { Field, TextAreaField } from "@/components/ui/Field";

type TaskDialogProps = {
  note: ITodoQuery;
  archiveLabel: "Archive" | "Unarchive";
  minDate: string;
  onChange: (patch: Partial<ITodoQuery>) => void;
  onDeadlineChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onArchive: () => void;
};

/** Edit task: a centered dialog on desktop, a bottom sheet on mobile. */
export default function TaskDialog(props: TaskDialogProps) {
  const { note, onChange } = props;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.onSave();
  };

  return (
    <Dialog onClose={props.onClose} labelledBy="edit-task-title" variant="responsive">
      <DialogHeader id="edit-task-title" title="Edit task" onClose={props.onClose} />
      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px] md:gap-[22px]">
        <Field
          id="edit-title"
          label="Title"
          value={note.title}
          onChange={(e) => onChange({ title: e.target.value })}
          inputClassName="h-12 text-[17px] font-semibold md:text-lg"
        />
        <TextAreaField
          id="edit-details"
          label="Details"
          rows={5}
          value={note.content}
          onChange={(e) => onChange({ content: e.target.value })}
          inputClassName="max-md:h-[122px]"
        />
        <Field
          id="edit-deadline"
          label="Deadline"
          type="date"
          value={note.deadline || ""}
          min={props.minDate}
          onChange={props.onDeadlineChange}
          className="md:w-[220px]"
          inputClassName="max-md:h-12"
        />

        <div className="grid grid-cols-2 gap-2.5 md:flex md:items-center md:border-t md:pt-1.5">
          <Button
            type="button"
            variant="secondary"
            onClick={props.onDelete}
            icon={<Trash2 size={18} />}
            className="order-3 h-12 font-bold text-danger md:order-none md:h-11 md:border-transparent md:bg-transparent md:px-4 md:hover:bg-danger/10"
          >
            Delete
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={props.onArchive}
            icon={<Archive size={18} />}
            className="order-2 h-12 md:order-none md:ml-auto md:h-11"
          >
            {props.archiveLabel}
          </Button>
          <Button type="submit" size="lg" className="order-1 col-span-2 md:order-none md:h-11">
            Save changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
