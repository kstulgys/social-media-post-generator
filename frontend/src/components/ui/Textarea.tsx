import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  showCount?: boolean;
  maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, showCount, maxLength, value, className = "", ...props }, ref) => {
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {label} {required && <span className="text-pink-500">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          className={`input-dark min-h-[120px] resize-none ${
            error ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""
          } ${className}`}
          {...props}
        />
        <div className="flex justify-between mt-2">
          {error ? <p className="text-sm text-red-400">{error}</p> : <span />}
          {showCount && maxLength && (
            <span className="text-xs text-zinc-500">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
