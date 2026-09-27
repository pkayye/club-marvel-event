import type { ReactNode } from "react";

/**
 * Form primitives.
 *
 * Underline-only inputs keep the Swiss grid intact: a box would break the
 * horizontal rules, a rule *is* the design. Real `<label for>` on every field,
 * so the form works for screen readers and for clicking.
 */

const controlClass =
  "w-full border-b border-rule-strong bg-transparent py-2.5 text-base text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-red";

function Labelled({
  name,
  label,
  required,
  hint,
  children,
}: {
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="label-mono text-ink-soft">
        {label}
        {required ? (
          <span className="text-red" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}

export function TextField({
  name,
  label,
  type = "text",
  required,
  hint,
  autoComplete,
  placeholder,
  inputMode,
  pattern,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  pattern?: string;
}) {
  return (
    <Labelled name={name} label={label} required={required} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        pattern={pattern}
        className={controlClass}
      />
    </Labelled>
  );
}

export function TextAreaField({
  name,
  label,
  rows = 3,
  required,
  hint,
  placeholder,
}: {
  name: string;
  label: string;
  rows?: number;
  required?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <Labelled name={name} label={label} required={required} hint={hint}>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={`${controlClass} resize-y`}
      />
    </Labelled>
  );
}

export function SelectField({
  name,
  label,
  options,
  required,
  hint,
}: {
  name: string;
  label: string;
  options: readonly string[];
  required?: boolean;
  hint?: string;
}) {
  return (
    <Labelled name={name} label={label} required={required} hint={hint}>
      <select id={name} name={name} required={required} className={controlClass}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Labelled>
  );
}
