import React from "react";

export function Backdrop() {
  return (
    <div
      aria-hidden="true"
      className="chai-backdrop overflow-hidden h-[900px] select-none"
    >
      <svg
        viewBox="0 0 2842 1132"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-60 dark:opacity-80"
      >
        <defs>
          {/* Ambient Glow Gradients */}
          <radialGradient
            id="center-glow"
            cx="50%"
            cy="15%"
            r="45%"
            fx="50%"
            fy="15%"
          >
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#78350f" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient
            id="subtle-left"
            cx="25%"
            cy="30%"
            r="30%"
          >
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Hexagon Pattern */}
          <pattern
            id="chai-hex-pattern"
            width="56"
            height="96.99"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            <path
              d="M28 0 L56 16.165 L56 48.497 L28 64.662 L0 48.497 L0 16.165 Z M28 96.99 L56 80.825 L56 48.497 L28 64.662 L0 48.497 L0 80.825 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              className="text-white/[0.04] dark:text-white/[0.035]"
            />
          </pattern>
        </defs>

        {/* Ambient Soft Glow Background */}
        <rect width="100%" height="100%" fill="url(#center-glow)" />
        <rect width="100%" height="100%" fill="url(#subtle-left)" />

        {/* Hex Grid Overlay */}
        <rect width="100%" height="100%" fill="url(#chai-hex-pattern)" />
      </svg>
    </div>
  );
}

export default Backdrop;
