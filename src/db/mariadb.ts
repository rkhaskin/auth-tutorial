import mariadb from "mariadb";
import { fileLogger } from "@/logger/logger";

let port: number = 3306;
if (process.env.DB_PORT) {
  port = parseInt(process.env.DB_PORT);
}

export const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port,
  connectionLimit: 5,
  debugLen: 4096,
  logger: {
    query: (msg) => {
      fileLogger.info(msg);
    },
  },
});
