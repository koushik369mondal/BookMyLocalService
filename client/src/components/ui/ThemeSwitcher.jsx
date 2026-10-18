import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={cn(
        "group relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 bg-card/60 backdrop-blur-sm transition-colors hover:border-border hover:bg-card focus:outline-none focus-visible:ring-1 focus-visible:ring-ring select-none cursor-pointer",
        className
      )}
      title={`Toggle theme (currently ${theme})`}
    >
      {/* Half-circle icon glyph */}
      <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden rounded-full border border-neutral-400 dark:border-neutral-500 transition-transform duration-300 group-hover:rotate-180">
        <span className="absolute top-0 left-0 h-full w-1/2 bg-neutral-900 dark:bg-white" />
        <span className="absolute top-0 right-0 h-full w-1/2 bg-transparent" />
      </span>
    </button>
  );
}

export default ThemeSwitcher;
