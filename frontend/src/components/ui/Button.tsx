import { ButtonHTMLAttributes, ReactNode } from "react";
import { SpinnerIcon } from "@/components/icons";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  variant?: "gradient" | "secondary";
  icon?: ReactNode;
}

export function Button({
  children,
  isLoading,
  loadingText = "Generating...",
  variant = "gradient",
  icon,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "flex items-center justify-center gap-2 font-semibold transition-all";
  const variantStyles = {
    gradient: "btn-gradient",
    secondary: "px-6 py-3 bg-zinc-800 text-white rounded-full hover:bg-zinc-700",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <SpinnerIcon />
          {loadingText}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
