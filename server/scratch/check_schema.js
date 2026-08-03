const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Review';
    `);
    console.log("Review Table Columns in DB:", res.rows);

    // If 'title' column doesn't exist, add it directly via DDL SQL!
    const hasTitle = res.rows.some(r => r.column_name === 'title');
    if (!hasTitle) {
      console.log("Adding 'title' column to Review table in PostgreSQL database...");
      await pool.query(`ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "title" TEXT;`);
      console.log("✅ 'title' column added successfully!");
    } else {
      console.log("✅ 'title' column already exists in Review table.");
    }
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await pool.end();
  }
}

check();
