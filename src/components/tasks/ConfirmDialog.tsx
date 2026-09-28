import { useId } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/Dialog";

type ConfirmDialogProps = {
  title: string;
  body: string;
  confirmLabel: string;
  tone: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
};

/** Small centered yes/cancel dialog. */
export default function ConfirmDialog({ title, body, confirmLabel, tone, onConfirm, onCancel }: ConfirmDialogProps) {
  const titleId = useId();

  return (
    <Dialog onClose={onCancel} labelledBy={titleId} className="max-w-[400px] gap-2">
      <h2 id={titleId} className="font-display text-[22px] font-extrabold tracking-[-0.02em]">
        {title}
      </h2>
      <p className="text-[15px] text-muted">{body}</p>
      <div className="mt-4 flex justify-end gap-2.5">
        {/* Focus starts on Cancel so Enter never confirms by accident. */}
        <Button type="button" variant="secondary" onClick={onCancel} data-autofocus>
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className={cn(tone === "danger" && "bg-danger-solid text-white hover:bg-danger-solid/90")}
        >
          {confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
}
