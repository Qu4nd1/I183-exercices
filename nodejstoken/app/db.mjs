import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "db",
  port: 3306,
  user: "db_user",
  password: process.env.DB_PASSWORD,
  database: "db_authentication",
});
