"use client";

import { Platform } from "@/types";
import { PLATFORM_OPTIONS } from "@/constants";
import { TwitterIcon, InstagramIcon, LinkedInIcon, CheckIcon } from "@/components/icons";

interface PlatformSelectorProps {
  value: Platform[];
  onChange: (platforms: Platform[]) => void;
  disabled?: boolean;
  error?: string;
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  twitter: <TwitterIcon />,
  instagram: <InstagramIcon />,
  linkedin: <LinkedInIcon />,
};

export function PlatformSelector({ value, onChange, disabled, error }: PlatformSelectorProps) {
  const togglePlatform = (platform: Platform) => {
    const isSelected = value.includes(platform);
    const newPlatforms = isSelected
      ? value.filter((p) => p !== platform)
      : [...value, platform];
    onChange(newPlatforms);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-3">
        Platforms <span className="text-pink-500">*</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {PLATFORM_OPTIONS.map((option) => {
          const isSelected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => togglePlatform(option.value)}
              disabled={disabled}
              className={`toggle-btn flex items-center gap-2 ${
                isSelected ? "toggle-btn-active" : "toggle-btn-inactive"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {PLATFORM_ICONS[option.value]}
              <span>{option.label}</span>
              {isSelected && <CheckIcon className="h-4 w-4 text-purple-400" />}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
