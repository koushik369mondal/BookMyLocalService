import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import logoLight from "/logo.png";
import logoDark from "/logo.png";

export default function Logo({ size = 40, showText = true }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: size, width: size * 3 }} />;

  const logoSrc = resolvedTheme === "dark" ? logoDark : logoLight;

  return (
    <div className="flex items-center gap-2 select-none">
      <img
        src={logoSrc}
        alt="BookMyLocalService logo"
        style={{ height: size, width: "auto" }}
        className="object-contain"
      />

      {/* Note: New logos already contain the brand name text. 
          The spans below can be toggled if custom text is still needed,
          but they are hidden by default for the new branding assets. */}
      {showText && (
        <span className="text-xl tracking-tight hidden md:block font-bold text-inherit">
          BookMyLocal<span className="text-[#C9A46A]">Service</span>
        </span>
      )}
    </div>
  );
}
