/**
 * Utility to optimize Cloudinary image URLs with responsive transformations, format conversion (auto/webp), and quality optimization.
 * If the image URL is not from Cloudinary or invalid, returns the original URL unchanged.
 * 
 * @param {string} url - Original image URL
 * @param {object} options - Optimization options
 * @param {number} [options.width] - Maximum image width in px
 * @param {number} [options.height] - Maximum image height in px
 * @param {string} [options.crop="fill"] - Crop mode ("fill", "limit", "fit", "scale", "thumb")
 * @param {string} [options.quality="auto"] - Quality ("auto", "auto:good", "auto:best")
 * @param {string} [options.format="auto"] - Format ("auto", "webp")
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(url, options = {}) {
  if (!url || typeof url !== "string") return "";

  // Check if URL is from Cloudinary
  if (!url.includes("cloudinary.com") || !url.includes("/upload/")) {
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

  // Insert transformations after /upload/ and any version prefix
  return url.replace(/\/upload\/(?:v\d+\/)?/, (match) => {
    return `${match}${transformString}/`;
  });
}
