export function cn(...inputs) {
  return inputs.flat(Infinity).filter(Boolean).join(" ");
}

/**
 * Generates 2-letter uppercase initials from a user's name.
 * e.g., "Kaushik Mandal" -> "KM", "John Doe" -> "JD", "Madonna" -> "MA"
 * @param {string} name - Full name of user
 * @returns {string} Uppercase initials (max 2 letters)
 */
export function getUserInitials(name) {
  if (!name || typeof name !== "string") return "U";
  const trimmed = name.trim();
  if (!trimmed) return "U";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  } else if (parts.length === 1) {
    const single = parts[0];
    if (single.length >= 2) {
      return single.substring(0, 2).toUpperCase();
    }
    return single.charAt(0).toUpperCase();
  }
  return "U";
}
