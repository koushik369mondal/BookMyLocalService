const jwt = require("jsonwebtoken");
const { DEFAULT_JWT_EXPIRES_IN } = require("../constants/auth.constants");

/**
 * Generate JWT token for an authenticated user.
 * Supports positional arguments (id, role) or single object argument { id, role }.
 * @param {string|object} idOrPayload - User ID string or payload object { id, role }
 * @param {string} [role] - User role
 * @returns {string} Signed JWT token
 */
const generateToken = (idOrPayload, role) => {
    const secret = process.env.JWT_SECRET || "bookmylocalservice-super-secret-jwt-key-2026";
    let payload;

    if (typeof idOrPayload === "object" && idOrPayload !== null) {
        payload = { id: idOrPayload.id, role: idOrPayload.role };
    } else {
        payload = { id: idOrPayload, role };
    }

    if (!payload.id || typeof payload.id !== "string") {
        throw new Error(`Invalid user ID provided for JWT generation: ${JSON.stringify(idOrPayload)}`);
    }

    return jwt.sign(payload, secret, { expiresIn: DEFAULT_JWT_EXPIRES_IN });
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
