import React from "react";
import { Wrench, ImageOff } from "lucide-react";

export function ServiceImagePlaceholder({ className = "w-full h-full", iconSize = "h-8 w-8", title = "Service Image" }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-muted/40 border border-border/80 text-muted-foreground p-4 text-center select-none ${className}`}>
      <div className="p-3 bg-card rounded-2xl border border-border/80 mb-2">
        <Wrench className={`${iconSize} text-muted-foreground`} />
      </div>
      <span className="text-xs font-medium text-foreground line-clamp-1">{title}</span>
      <span className="text-[10px] text-muted-foreground font-mono">BookMyLocalService</span>
    </div>
  );
}

export function AvatarPlaceholder({ name = "Pro", className = "h-8 w-8 text-xs" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "P";

  return (
    <div className={`flex items-center justify-center bg-card text-foreground font-semibold rounded-full border border-border/80 shrink-0 select-none ${className}`}>
      {initials}
    </div>
  );
}

export default ServiceImagePlaceholder;
