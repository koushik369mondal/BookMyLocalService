import React from "react";
import logoImg from "/logo.png";
import { cn } from "@/lib/utils";

export default function Logo({ size = 32, showText = true, className = "" }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <img
        src={logoImg}
        alt="BookMyLocalService"
        style={{ height: size, width: "auto" }}
        className="object-contain"
      />
      {showText && (
        <span className="font-brand text-lg sm:text-xl font-semibold tracking-tight text-foreground flex items-center gap-1">
          <span>BookMyLocal</span>
          <span className="text-foreground">Service</span>
          <span className="inline-block size-1.5 rounded-full bg-brand" />
        </span>
      )}
    </div>
  );
}
