import type { ChangeEvent, FormEvent } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, TextAreaField } from "@/components/ui/Field";

type AddTaskFormProps = {
  /** "inline" is the desktop row; "sheet" is the stacked mobile form. */
  layout: "inline" | "sheet";
  title: string;
  content: string;
  deadline: string;
  minDate: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onDeadlineChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  className?: string;
};

/** New-task form. Details stay required: the backend's `content` field doesn't allow blanks. */
export default function AddTaskForm(props: AddTaskFormProps) {
  const { layout, title, content, deadline, minDate, className } = props;
  const sheet = layout === "sheet";
  const id = (name: string) => `${layout}-new-${name}`;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        sheet
          ? "flex flex-col gap-[18px]"
          : "items-end gap-3 rounded-[18px] border bg-surface p-4 shadow-form",
        className,
      )}
    >
      <Field
        id={id("title")}
        label="Title"
        value={title}
        onChange={(e) => props.onTitleChange(e.target.value)}
        placeholder="What needs doing?"
        autoFocus={sheet}
        data-autofocus={sheet || undefined}
        className={sheet ? undefined : "flex-1"}
        inputClassName={sheet ? "h-12" : undefined}
      />
      {sheet ? (
        <TextAreaField
          id={id("details")}
          label="Details"
          rows={3}
          value={content}
          onChange={(e) => props.onContentChange(e.target.value)}
          placeholder="Add a note"
        />
      ) : (
        <Field
          id={id("details")}
          label="Details"
          value={content}
          onChange={(e) => props.onContentChange(e.target.value)}
          placeholder="Add a note"
          className="flex-[1.4]"
        />
      )}
      <Field
        id={id("deadline")}
        label="Deadline"
        type="date"
        value={deadline}
        min={minDate}
        onChange={props.onDeadlineChange}
        className={sheet ? undefined : "w-[184px] shrink-0"}
        inputClassName={sheet ? "h-12" : undefined}
      />
      <Button
        type="submit"
        size={sheet ? "lg" : "md"}
        icon={<Plus size={18} strokeWidth={2.25} />}
        className={sheet ? "w-full" : "h-[46px]"}
      >
        Add task
      </Button>
    </form>
  );
}
