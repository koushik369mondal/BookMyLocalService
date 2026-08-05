/**
 * Default fallback image placeholders (SVG Data URIs)
 */
export const DEFAULT_SERVICE_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500' fill='none'%3E%3Crect width='800' height='500' fill='%23FAF6F0'/%3E%3Crect x='350' y='160' width='100' height='80' rx='16' fill='%238C4B3E' fill-opacity='0.12' stroke='%238C4B3E' stroke-width='3'/%3E%3Cpath d='M380 190H420M380 210H405' stroke='%238C4B3E' stroke-width='4' stroke-linecap='round'/%3E%3Ctext x='400' y='290' text-anchor='middle' fill='%231F1D1A' font-family='sans-serif' font-size='22' font-weight='800'%3EBookMyLocalService%3C/text%3E%3Ctext x='400' y='320' text-anchor='middle' fill='%237A7266' font-family='sans-serif' font-size='14' font-weight='600'%3EVerified Local Specialist%3C/text%3E%3C/svg%3E";

export const DEFAULT_PROVIDER_AVATAR = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200' fill='none'%3E%3Ccircle cx='100' cy='100' r='100' fill='%238C4B3E'/%3E%3Cpath d='M100 55C80.67 55 65 70.67 65 90C65 109.33 80.67 125 100 125C119.33 125 135 109.33 135 90C135 70.67 119.33 55 100 55ZM100 140C73.33 140 45 153.33 45 170V180H155V170C155 153.33 126.67 140 100 140Z' fill='white'/%3E%3C/svg%3E";

/**
 * Utility to optimize Cloudinary image URLs with responsive transformations.
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") return "";

  if (!url.includes("cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  // If transformations already exist right after /upload/, return as-is to avoid duplicate parameters
  if (/\/upload\/(?:[a-z]_[a-z0-9_,-]+\/)+/i.test(url)) {
    return url;
  }

  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto"
  } = options;

  const transformations = [`f_${format}`, `q_${quality}`];

  if (crop) transformations.push(`c_${crop}`);
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);

  const transformString = transformations.join(",");

  return url.replace("/upload/", `/upload/${transformString}/`);
}

/**
 * Resolves standardized service image URL with optimization and fallback.
 */
export function getServiceImage(serviceOrUrl, options = {}) {
  let url = "";
  if (typeof serviceOrUrl === "string") {
    url = serviceOrUrl;
  } else if (serviceOrUrl && typeof serviceOrUrl === "object") {
    url = serviceOrUrl.imageUrl || serviceOrUrl.image || serviceOrUrl.category?.imageUrl || "";
  }

  if (!url) return DEFAULT_SERVICE_IMAGE;
  return getOptimizedImageUrl(url, options);
}

/**
 * Resolves standardized provider profile image URL with optimization and fallback.
 */
export function getProviderImage(providerOrUrl, options = {}) {
  let url = "";
  if (typeof providerOrUrl === "string") {
    url = providerOrUrl;
  } else if (providerOrUrl && typeof providerOrUrl === "object") {
    url = providerOrUrl.profileImage || providerOrUrl.avatar || providerOrUrl.providerProfileImage || providerOrUrl.providerImage || providerOrUrl.provider?.profileImage || providerOrUrl.provider?.avatar || "";
  }

  if (!url) return DEFAULT_PROVIDER_AVATAR;
  return getOptimizedImageUrl(url, options);
}
