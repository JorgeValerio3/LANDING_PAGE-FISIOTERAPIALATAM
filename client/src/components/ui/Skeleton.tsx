import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rect" | "circle";
}

export function Skeleton({ className, variant = "rect" }: SkeletonProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "animate-pulse bg-gray-200/50 dark:bg-gray-700/50",
          variant === "text" && "h-4 w-full rounded",
          variant === "rect" && "rounded-lg",
          variant === "circle" && "rounded-full aspect-square",
          className
        )
      )}
    />
  );
}
