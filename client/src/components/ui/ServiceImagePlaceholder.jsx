import React from "react";
import { Wrench, ImageOff } from "lucide-react";

export function ServiceImagePlaceholder({ className = "w-full h-full", iconSize = "h-8 w-8", title = "Service Image" }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-[#F0E7D5] border border-[#E8DCC3] text-[#7A7266] p-4 text-center select-none ${className}`}>
      <div className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#E8DCC3] mb-2 shadow-2xs">
        <Wrench className={`${iconSize} text-[#8C4B3E]`} />
      </div>
      <span className="text-xs font-bold text-[#1F1D1A] line-clamp-1">{title}</span>
      <span className="text-[10px] text-[#7A7266] font-medium">BookMyLocalService</span>
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
    <div className={`flex items-center justify-center bg-[#8C4B3E] text-white font-extrabold rounded-full border border-[#E8DCC3] shadow-2xs shrink-0 select-none ${className}`}>
      {initials}
    </div>
  );
}

export default ServiceImagePlaceholder;
