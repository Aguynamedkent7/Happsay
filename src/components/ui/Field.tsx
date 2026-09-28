import { useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** Input styles. `auth` pages use a surface background and taller inputs. */
function inputClass(auth = false) {
  return cn(
    "w-full rounded-xl border border-input-border px-3.5 text-base text-fg outline-none",
    "placeholder:text-muted transition-[border-color,box-shadow]",
    "focus:border-primary focus:ring-[3px] focus:ring-primary/20 focus-visible:outline-none",
    auth ? "h-[50px] bg-surface px-4" : "h-[46px] bg-bg",
  );
}

type LabelProps = { id: string; label: string; auth?: boolean; aside?: ReactNode };

function FieldLabel({ id, label, auth, aside }: LabelProps) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <label htmlFor={id} className={cn("font-semibold text-fg-2", auth ? "text-sm" : "text-[13px]")}>
        {label}
      </label>
      {aside}
    </div>
  );
}

export type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  auth?: boolean;
  /** Rendered on the right of the label row (e.g. "Forgot password?"). */
  labelAside?: ReactNode;
  /** Rendered inside the input, on the right (e.g. the password eye). */
  adornment?: ReactNode;
  inputClassName?: string;
};

/** A labelled text input wired with htmlFor/id. */
export function Field({ id, label, auth, labelAside, adornment, className, inputClassName, ...props }: FieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <FieldLabel id={id} label={label} auth={auth} aside={labelAside} />
      <div className="relative">
        <input id={id} className={cn(inputClass(auth), adornment && "pr-12", inputClassName)} {...props} />
        {adornment}
      </div>
    </div>
  );
}

type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  inputClassName?: string;
};

/** A labelled textarea with the same look as Field. */
export function TextAreaField({ id, label, className, inputClassName, ...props }: TextAreaFieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <FieldLabel id={id} label={label} />
      <textarea
        id={id}
        className={cn(inputClass(), "h-auto resize-y py-3 leading-normal", inputClassName)}
        {...props}
      />
    </div>
  );
}

/** A Field with a show/hide password toggle inside the input. */
export function PasswordField(props: Omit<FieldProps, "type" | "adornment">) {
  const [visible, setVisible] = useState(false);

  return (
    <Field
      {...props}
      type={visible ? "text" : "password"}
      adornment={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-muted hover:text-fg"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      }
    />
  );
}
