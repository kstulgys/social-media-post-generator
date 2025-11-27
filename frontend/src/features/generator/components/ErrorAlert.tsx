"use client";

import { AlertCircleIcon } from "@/components/icons";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="card-dark p-4 mb-8 border-red-500/30 bg-red-500/5">
      <div className="flex items-start gap-3">
        <AlertCircleIcon className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-red-300">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-400 hover:text-red-300 underline underline-offset-2"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
