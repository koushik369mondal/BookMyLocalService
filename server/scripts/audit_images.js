require("dotenv").config();
const prisma = require("../config/prisma");
const https = require("https");
const http = require("http");

async function checkUrl(url) {
  if (!url) return { status: "missing", code: null };
  return new Promise((resolve) => {
    try {
      const client = url.startsWith("https") ? https : http;
      const req = client.request(url, { method: "HEAD", timeout: 5000 }, (res) => {
        resolve({ status: res.statusCode === 200 ? "ok" : "broken", code: res.statusCode });
      });
      req.on("error", (err) => resolve({ status: "error", code: err.message }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ status: "timeout", code: "ETIMEDOUT" });
      });
      req.end();
    } catch (e) {
      resolve({ status: "error", code: e.message });
    }
  });
}

async function audit() {
  console.log("🔍 AUDITING USERS & SERVICES IMAGE RECORDS IN DATABASE...\n");

  const users = await prisma.user.findMany({
    select: { id: true, fullName: true, role: true, avatar: true }
  });

  console.log(`--- USERS (${users.length}) ---`);
  for (const u of users) {
    const res = await checkUrl(u.avatar);
    console.log(`User [${u.id}] (${u.role}) "${u.fullName}": avatar = "${u.avatar || "NULL"}" | Check: ${res.status} (${res.code})`);
  }

  const services = await prisma.service.findMany({
    select: { id: true, title: true, imageUrl: true, providerId: true }
  });

  console.log(`\n--- SERVICES (${services.length}) ---`);
  for (const s of services) {
    const res = await checkUrl(s.imageUrl);
    console.log(`Service [${s.id}] "${s.title}": imageUrl = "${s.imageUrl || "NULL"}" | Check: ${res.status} (${res.code})`);
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, imageUrl: true }
  });

  console.log(`\n--- CATEGORIES (${categories.length}) ---`);
  for (const c of categories) {
    const res = await checkUrl(c.imageUrl);
    console.log(`Category [${c.id}] "${c.name}": imageUrl = "${c.imageUrl || "NULL"}" | Check: ${res.status} (${res.code})`);
  }

  await prisma.$disconnect();
}

audit().catch(console.error);
