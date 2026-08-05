import React, { useState } from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, getUserInitials } from "@/lib/utils";
import { getProviderImage, DEFAULT_PROVIDER_AVATAR } from "@/utils/imageUtils";

/**
 * Standardized ProviderAvatar component.
 * Robustly resolves profile images, optimizes Cloudinary URLs, handles loading states,
 * and falls back gracefully on missing or broken (404) URLs.
 */
export function ProviderAvatar({
  provider,
  src,
  name,
  className = "w-10 h-10 border border-[#E8DCC3]",
  fallbackClassName = "bg-[#8C4B3E] text-white font-extrabold uppercase",
  imageClassName = "object-cover size-full",
  size = 160,
  ...props
}) {
  const [imgError, setImgError] = useState(false);

  const displayName = name || provider?.fullName || provider?.name || provider?.providerName || "Provider";
  const initials = getUserInitials(displayName);

  const resolvedSrc = imgError
    ? DEFAULT_PROVIDER_AVATAR
    : getProviderImage(src || provider, { width: size, height: size });

  return (
    <AvatarPrimitive.Root
      data-slot="provider-avatar"
      className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      <AvatarPrimitive.Image
        data-slot="avatar-image"
        src={resolvedSrc}
        alt={displayName}
        className={cn("aspect-square size-full object-cover", imageClassName)}
        onError={() => setImgError(true)}
      />
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className={cn(
          "bg-[#8C4B3E] text-white flex size-full items-center justify-center rounded-full text-xs font-extrabold uppercase select-none",
          fallbackClassName
        )}
      >
        {initials}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

export default ProviderAvatar;
