interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export function Toggle({ checked, onChange, disabled, label, description }: ToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#0f0f17] rounded-xl border border-[#1f1f2e]">
      {(label || description) && (
        <div>
          {label && <h4 className="text-sm font-medium text-white">{label}</h4>}
          {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-zinc-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
