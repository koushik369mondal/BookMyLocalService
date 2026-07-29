const prisma = require("../config/prisma");
const { verifyToken } = require("../utils/jwt.util");
const { userSelect } = require("../utils/user.util");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            if (!token || token === "null" || token === "undefined") {
                return res.status(401).json({ success: false, message: "Not authorized, empty token provided" });
            }

            const decoded = verifyToken(token);

            // Safely extract string userId regardless of legacy payload structure
            let userId = decoded.id;
            if (typeof userId === "object" && userId !== null) {
                userId = userId.id;
            }

            if (!userId || typeof userId !== "string") {
                console.error("Auth middleware error: Malformed token payload:", decoded);
                return res.status(401).json({ success: false, message: "Not authorized, invalid token payload" });
            }

            // Attach user details to request
            req.user = await prisma.user.findUnique({
                where: { id: userId },
                select: userSelect
            });

            if (!req.user) {
                console.warn(`Auth middleware warning: No user found for ID '${userId}'`);
                return res.status(401).json({ success: false, message: "User account not found with this token" });
            }

            return next();
        } catch (error) {
            console.error("Auth middleware verification error:", error.message);
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Authentication token has expired. Please log in again." });
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({ success: false, message: "Invalid authentication token signature." });
            }
            return res.status(401).json({ success: false, message: "Not authorized, token verification failed", error: error.message });
        }
    }

    return res.status(401).json({ success: false, message: "Not authorized, no Bearer token provided" });
};

// Role based access middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user?.role || "none"}' is not authorized to access this resource`
            });
        }
        return next();
    };
};

module.exports = { protect, authorize };
