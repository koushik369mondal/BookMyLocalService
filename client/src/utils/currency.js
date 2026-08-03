/**
 * Centralized utility function to format any price value consistently with a single Indian Rupee symbol (₹).
 * Handles numbers, strings, values already containing currency symbols (₹, $),
 * and optional price types (e.g., "hourly", "/hr", "fixed", "/fixed").
 *
 * Examples:
 *   formatPrice(1499)                           => "₹1,499"
 *   formatPrice("1499")                         => "₹1,499"
 *   formatPrice("₹1,499")                       => "₹1,499"
 *   formatPrice("₹₹1,499")                      => "₹1,499"
 *   formatPrice("$1499")                        => "₹1,499"
 *   formatPrice(499, { priceType: "hourly" })   => "₹499/hr"
 *   formatPrice(2999, { priceType: "fixed" })   => "₹2,999/fixed"
 *   formatPrice(1499.5, { decimals: true })     => "₹1,499.50"
 */
export function formatPrice(price, options = {}) {
  if (price === null || price === undefined || price === "") {
    return "₹0";
  }

  const { priceType, decimals } = options;

  let numVal = 0;
  let extractedSuffix = "";

  if (typeof price === "number") {
    numVal = isNaN(price) ? 0 : price;
  } else if (typeof price === "string") {
    let cleaned = price.trim();

    // Check if price string has priceType embedded like "1499/hr", "₹1,499 / fixed", or "499/hourly"
    if (cleaned.includes("/")) {
      const parts = cleaned.split("/");
      cleaned = parts[0].trim();
      extractedSuffix = `/${parts[1].trim()}`;
    }

    // Strip currency symbols like ₹, $, INR and whitespace
    cleaned = cleaned.replace(/[₹$]/g, "").replace(/\bINR\b/gi, "").trim();

    // Remove thousands separators (commas)
    cleaned = cleaned.replace(/,/g, "");

    const parsed = parseFloat(cleaned);
    numVal = isNaN(parsed) ? 0 : parsed;
  } else {
    numVal = 0;
  }

  let formattedNum = "";
  if (decimals === true) {
    formattedNum = numVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (decimals === false) {
    formattedNum = numVal.toLocaleString("en-IN", { maximumFractionDigits: 0 });
  } else {
    // Format integer without trailing .00 if whole number, or with 2 decimals if fraction exists
    const hasFraction = numVal % 1 !== 0;
    formattedNum = numVal.toLocaleString("en-IN", {
      minimumFractionDigits: hasFraction ? 2 : 0,
      maximumFractionDigits: hasFraction ? 2 : 0
    });
  }

  // Determine suffix
  let formattedSuffix = "";
  const effectiveType = priceType || extractedSuffix;
  if (effectiveType) {
    const lowerType = effectiveType.toLowerCase();
    if (lowerType === "hourly" || lowerType === "/hr" || lowerType === "hr") {
      formattedSuffix = "/hr";
    } else if (lowerType === "fixed" || lowerType === "/fixed") {
      formattedSuffix = "/fixed";
    } else if (effectiveType.startsWith("/")) {
      formattedSuffix = effectiveType;
    } else {
      formattedSuffix = `/${effectiveType}`;
    }
  }

  return `₹${formattedNum}${formattedSuffix}`;
}

export const formatCurrency = formatPrice;
