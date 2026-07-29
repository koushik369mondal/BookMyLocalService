const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email address format.
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
    if (!email || typeof email !== "string") return false;
    return EMAIL_REGEX.test(email.toLowerCase().trim());
};

module.exports = {
    EMAIL_REGEX,
    isValidEmail
};
