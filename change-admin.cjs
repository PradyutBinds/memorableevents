require("dotenv").config();

const crypto = require("crypto");
const { Pool } = require("pg");

(async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const username = "Memorableadmin";
  const password = "Memorable@2026";

  const hash = crypto
    .createHash("sha256")
    .update(password + "ua_salt_2024")
    .digest("hex");

  const result = await pool.query(
    "UPDATE admins SET username = $1, password_hash = $2 WHERE username IN ($3, $4, $5)",
    [username, hash, "admin", "universaladmin", username]
  );

  if (result.rowCount === 0) {
    throw new Error("No matching admin account found; credentials were not changed.");
  }

  console.log("✅ Admin credentials updated");
  await pool.end();
})();
