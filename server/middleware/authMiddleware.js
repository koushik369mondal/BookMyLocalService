const prisma = require("../config/prisma");
const { verifyToken } = require("../utils/jwt.util");
const { userSelect } = require("../utils/user.util");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = verifyToken(token);

            // Attach user details to request
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: userSelect
            });

            if (!req.user) {
                return res.status(401).json({ success: false, message: "User not found with this token" });
            }

            return next();
        } catch (error) {
            console.error("Auth middleware error:", error);
            return res.status(401).json({ success: false, message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
    }
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
