const { protect, authorize } = require("./authMiddleware");

/**
 * Middleware that allows access only to authenticated users with the ADMIN role.
 * Protects routes with both JWT authentication and role-based authorization.
 */
const adminMiddleware = async (req, res, next) => {
    return protect(req, res, (err) => {
        if (err) return next(err);
        
        const userRole = req.user?.role?.toUpperCase();
        if (!req.user || userRole !== "ADMIN") {
            console.warn(`[ADMIN AUTH 403] Authorization denied for ${req.method} ${req.originalUrl}. User ID: '${req.user?.id || "unauthenticated"}', Role: '${req.user?.role || "none"}'`);
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
                reason: "ADMIN_ACCESS_REQUIRED"
            });
        }
        
        return next();
    });
};

module.exports = adminMiddleware;
