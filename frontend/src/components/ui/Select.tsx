import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDownIcon } from "@/components/icons";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: readonly SelectOption[];
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, required, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {label}{" "}
            {required ? (
              <span className="text-pink-500">*</span>
            ) : (
              <span className="text-zinc-500">(optional)</span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`input-dark appearance-none cursor-pointer pr-10 ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#0f0f17]">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
