"use client";

import { Tone } from "@/types";
import { TONE_OPTIONS } from "@/constants";

interface ToneSelectorProps {
  value: Tone;
  onChange: (tone: Tone) => void;
  disabled?: boolean;
}

export function ToneSelector({ value, onChange, disabled }: ToneSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-3">Tone & Style</label>
      <div className="flex flex-wrap gap-2">
        {TONE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`toggle-btn ${
              value === option.value ? "toggle-btn-active" : "toggle-btn-inactive"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span className="mr-1.5">{option.emoji}</span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
