import React, { useState, useEffect } from "react";
import Logo from "./logo";

export default function AppLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1200);

    const unmountTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 1500);

    return () => {
      document.body.style.overflow = "";
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground transition-opacity duration-300 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <style>{`
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-fill {
          animation: fillProgress 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>

      <div className="flex flex-col items-center max-w-xs w-full px-6 gap-6">
        <Logo size={42} />

        {/* ChaiUI Neutral Progress Bar */}
        <div className="w-36 h-[2px] bg-border rounded-full overflow-hidden relative">
          <div className="h-full bg-foreground rounded-full animate-progress-fill absolute left-0 top-0" />
        </div>
      </div>
    </div>
  );
}
