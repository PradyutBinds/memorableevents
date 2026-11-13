require("dotenv").config();

const crypto = require("crypto");
const { Pool } = require("pg");

(async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const username = "universaladmin";
  const password = "Universal@2026";

  const hash = crypto
    .createHash("sha256")
    .update(password + "ua_salt_2024")
    .digest("hex");

  await pool.query(
    "UPDATE admins SET username = $1, password_hash = $2 WHERE username = $3",
    [username, hash, "admin"]
  );

  console.log("✅ Username & Password Updated");
  await pool.end();
})();