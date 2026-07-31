const prisma = require("../config/prisma");
const { verifyToken } = require("../utils/jwt.util");
const { userSelect } = require("../utils/user.util");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!token || token === "null" || token === "undefined") {
                console.warn(`[AUTH 401] Empty token provided for ${req.method} ${req.originalUrl}`);
                return res.status(401).json({ success: false, message: "Not authorized, empty token provided", reason: "EMPTY_TOKEN" });
            }

            const decoded = verifyToken(token);

            // Safely extract string userId regardless of legacy payload structure
            let userId = decoded.id;
            if (typeof userId === "object" && userId !== null) {
                userId = userId.id;
            }

            if (!userId || typeof userId !== "string") {
                console.error(`[AUTH 401] Malformed token payload for ${req.method} ${req.originalUrl}:`, decoded);
                return res.status(401).json({ success: false, message: "Not authorized, invalid token payload", reason: "MALFORMED_TOKEN_PAYLOAD" });
            }

            // Attach user details to request
            req.user = await prisma.user.findUnique({
                where: { id: userId },
                select: userSelect
            });

            if (!req.user) {
                console.warn(`[AUTH 401] User account not found for ID '${userId}' during ${req.method} ${req.originalUrl}`);
                return res.status(401).json({ success: false, message: "User account not found with this token", reason: "USER_NOT_FOUND" });
            }

            return next();
        } catch (error) {
            console.error(`[AUTH 401] Token verification error for ${req.method} ${req.originalUrl}:`, error.message);
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Authentication token has expired. Please log in again.", reason: "EXPIRED_TOKEN" });
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ success: false, message: "Invalid authentication token signature.", reason: "INVALID_TOKEN" });
            }
            return res.status(401).json({ success: false, message: "Not authorized, token verification failed", reason: "TOKEN_VERIFICATION_FAILED", error: error.message });
        }
    }

    console.warn(`[AUTH 401] Missing Bearer token for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ success: false, message: "Not authorized, no Bearer token provided", reason: "NO_TOKEN_PROVIDED" });
};

// Role based access middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user?.role?.toUpperCase();
        const allowedRoles = roles.map(r => r.toUpperCase());

        if (!req.user || !allowedRoles.includes(userRole)) {
            console.warn(`[AUTH 403] Authorization failed for ${req.method} ${req.originalUrl}. User ID: '${req.user?.id || "unauthenticated"}', Role: '${req.user?.role || "none"}', Allowed Roles: [${roles.join(", ")}]`);
            return res.status(403).json({
                success: false,
                message: `User role '${req.user?.role || "none"}' is not authorized to access this resource`,
                reason: "INVALID_ROLE"
            });
        }
        return next();
    };
};

module.exports = { protect, authorize };
