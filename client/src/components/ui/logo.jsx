import React from "react";
import logoImg from "/logo.png";

export default function Logo({ size = 40, showText = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <img
        src={logoImg}
        alt="BookMyLocalService logo"
        style={{ height: size, width: "auto" }}
        className="object-contain"
      />
      {showText && (
        <span className="text-xl tracking-tight hidden md:block font-extrabold text-[#1F1D1A]">
          BookMyLocal<span className="text-[#C9A46A]">Service</span>
        </span>
      )}
    </div>
  );
}
