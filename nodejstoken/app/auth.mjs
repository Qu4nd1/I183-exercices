import { hash } from "argon2";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { pool } from "./db.mjs";

const pepperHex = process.env.PEPPER;
if (!pepperHex) {
  throw new Error("PEPPER is not set: add it to .env");
}
const pepper = Buffer.from(pepperHex, "hex");

function validateInput(username, password) {
  if (typeof username !== "string" || typeof password !== "string") {
    throw new Error("Invalid input");
  }
  if (
    username.length === 0 ||
    username.length > 255 ||
    password.length < 8 ||
    password.length > 128
  ) {
    throw new Error("Invalid input");
  }
}
export async function register(username, password) {
  // 1. Validation
  validateInput(username, password);

  // TODO: salt
  const salt = randomBytes(16);

  // TODO: hash
  const passwordHash = await hash(password, {
    salt: salt,
    secret: pepper,
    raw: true,
  });

  // TODO: insert
  const sql =
    "INSERT INTO t_users (useName, usePassword, useSalt) VALUES (?, ?, ?)";
  try {
    await pool.execute(sql, [username, passwordHash, salt]);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("Username already taken");
    }
    throw err;
  }
}
export async function login(username, password) {
  validateInput(username, password);

  const sql = "SELECT usePassword, useSalt FROM t_users WHERE useName = ?";
  const [rows] = await pool.execute(sql, [username]);

  if (rows.length === 0) {
    throw new Error("Invalid credentials");
  }

  // TODO: recompute hash
  const row = rows[0];
  const candidate = await hash(password, {
    salt: row.useSalt,
    secret: pepper,
    raw: true,
  });
  // TODO: compare
  if (!timingSafeEqual(candidate, row.usePassword)) {
    throw new Error("Invalid credentials");
  } else {
    return true;
  }
}
