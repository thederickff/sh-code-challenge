import { createPool, Pool } from "promise-mysql";
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool;

export const initDB = async () => {
  try {
    pool = await createPool({
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionLimit: +process.env.DB_CONNECTION_LIMIT!
    });
  } catch (error) {
    console.error(error);
  }
};

export const execute = async (query: string, params?: (string|number)[]) => {
  if (!pool) {
    throw new Error('MySqlPoolWasNotCreated');
  }

  return await pool.query(query, params);
}