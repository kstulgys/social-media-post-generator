import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, prefix, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {label} {required && <span className="text-pink-500">*</span>}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">{prefix}</span>
          )}
          <input
            ref={ref}
            className={`input-dark ${prefix ? "pl-8" : ""} ${
              error ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
