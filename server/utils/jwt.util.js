const jwt = require("jsonwebtoken");
const { DEFAULT_JWT_EXPIRES_IN } = require("../constants/auth.constants");

/**
 * Generate JWT token for an authenticated user.
 * @param {string} id - User ID
 * @param {string} role - User role
 * @returns {string} Signed JWT token
 */
const generateToken = (id, role) => {
    const secret = process.env.JWT_SECRET || "bookmylocalservice-super-secret-jwt-key-2026";
    return jwt.sign({ id, role }, secret, { expiresIn: DEFAULT_JWT_EXPIRES_IN });
};

/**
 * Verify a JWT token.
 * @param {string} token - Bearer JWT token string
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || "bookmylocalservice-super-secret-jwt-key-2026";
    return jwt.verify(token, secret);
};

module.exports = {
    generateToken,
    verifyToken
};
