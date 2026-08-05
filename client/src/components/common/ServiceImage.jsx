import React, { useState } from "react";
import { getServiceImage, DEFAULT_SERVICE_IMAGE } from "@/utils/imageUtils";

/**
 * Standardized ServiceImage component.
 * Handles Cloudinary responsive optimization, skeleton loading state,
 * and graceful fallback on missing or broken (404) URLs.
 */
export function ServiceImage({
  service,
  src,
  alt = "Service Cover Image",
  className = "w-full h-full object-cover",
  width = 600,
  height = 350,
  crop = "fill",
  ...props
}) {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedSrc = imgError
    ? DEFAULT_SERVICE_IMAGE
    : getServiceImage(src || service, { width, height, crop });

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FAF6F0]">
      {!isLoaded && !imgError && (
        <div className="absolute inset-0 bg-stone-200/80 animate-pulse z-10 pointer-events-none" />
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setImgError(true);
          setIsLoaded(true);
        }}
        {...props}
      />
    </div>
  );
}

export default ServiceImage;
