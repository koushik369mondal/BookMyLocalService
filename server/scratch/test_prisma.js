require('dotenv').config();
const prisma = require('../config/prisma');

async function test() {
  try {
    console.log("Testing Prisma Client fields...");
    
    // Attempt to query the OTP fields specifically to test client-side schema validation
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        otpHash: true,
        otpExpiresAt: true,
        otpAttempts: true
      }
    });
    console.log("Prisma query succeeded!");
    console.log("Result (first user):", user);
  } catch (err) {
    console.error("Prisma Client check failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
