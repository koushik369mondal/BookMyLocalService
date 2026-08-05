/**
 * Utility functions for Cloudinary asset management and public ID extraction.
 */

/**
 * Extracts public_id from Cloudinary URL handling transformations and version numbers.
 * @param {string} url Cloudinary secure URL
 * @returns {string|null} Public ID or null
 */
function extractCloudinaryPublicId(url) {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
    return null;
  }

  try {
    const uploadSplit = url.split("/upload/");
    if (uploadSplit.length < 2) return null;

    let pathSegments = uploadSplit[1].split("/");

    // Filter out transformation string (e.g. f_auto,q_auto,c_fill,w_400,h_400)
    while (
      pathSegments.length > 0 &&
      (pathSegments[0].includes(",") ||
        pathSegments[0].includes("=") ||
        pathSegments[0].startsWith("c_") ||
        pathSegments[0].startsWith("w_") ||
        pathSegments[0].startsWith("f_") ||
        pathSegments[0].startsWith("q_"))
    ) {
      pathSegments.shift();
    }

    // Filter out version segment (e.g. v1785339076)
    if (pathSegments.length > 0 && /^v\d+$/.test(pathSegments[0])) {
      pathSegments.shift();
    }

    const fullPath = pathSegments.join("/");
    const lastDotIndex = fullPath.lastIndexOf(".");
    const publicId = lastDotIndex !== -1 ? fullPath.substring(0, lastDotIndex) : fullPath;

    return publicId || null;
  } catch (err) {
    console.error("Failed to extract Cloudinary public_id:", err);
    return null;
  }
}

module.exports = {
  extractCloudinaryPublicId
};
