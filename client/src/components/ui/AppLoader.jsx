import React, { useState, useEffect } from "react";

export default function AppLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Lock scrolling on mount
    document.body.style.overflow = "hidden";

    // Start fade out after 1.6 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1600);

    // Unmount loader after 2.0 seconds (1.6s progress + 0.4s fade animation)
    const unmountTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 2000);

    return () => {
      // Clean up body overflow when unmounted
      document.body.style.overflow = "";
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F8FAFC] transition-all duration-400 ease-out-expo ${
        fadeOut ? "opacity-0 scale-102 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <style>{`
        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes subtleScale {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .animate-progress-fill {
          animation: fillProgress 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-subtle-scale {
          animation: subtleScale 2.5s ease-in-out infinite;
        }
        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div className="flex flex-col items-center max-w-xs w-full px-6">
        {/* Centered Logo with Subtle Pulse & Scale */}
        <div className="mb-4 relative flex items-center justify-center animate-subtle-scale">
          <img
            src="/logo.png"
            alt="BookMyLocalService Logo"
            className="h-20 w-auto object-contain drop-shadow-sm"
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#0F172A] mb-8 font-sans">
          BookMyLocalService
        </h1>

        {/* Progress Bar Container */}
        <div className="w-40 h-[4px] bg-[#E2E8F0] rounded-full overflow-hidden relative shadow-inner">
          {/* Progress Bar Fill */}
          <div className="h-full bg-[#F59E0B] rounded-full animate-progress-fill absolute left-0 top-0"></div>
        </div>
      </div>
    </div>
  );
}
