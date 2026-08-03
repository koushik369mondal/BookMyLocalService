const prisma = require("../config/prisma");

/**
 * @desc    Health Check API endpoint
 * @route   GET /api/health (and GET /health)
 * @access  Public
 */
const getHealthStatus = async (req, res) => {
  const startTime = Date.now();
  let dbStatus = "disconnected";
  let dbResponseTimeMs = null;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbResponseTimeMs = Date.now() - dbStart;
    dbStatus = "connected";
  } catch (error) {
    dbStatus = "error: " + error.message;
  }

  const isHealthy = dbStatus === "connected";
  const status = isHealthy ? "OK" : "DEGRADED";
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    status,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    responseTimeMs: Date.now() - startTime,
    services: {
      database: {
        status: dbStatus,
        responseTimeMs: dbResponseTimeMs
      },
      server: {
        status: "running",
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || "development"
      }
    }
  });
};

module.exports = {
  getHealthStatus
};
