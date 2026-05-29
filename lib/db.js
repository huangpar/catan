import { Pool } from 'pg';
import {
  getConnectionString,
  MissingDatabaseConnectionError,
} from '@netlify/database';

function resolveConnectionString() {
  try {
    return getConnectionString();
  } catch (error) {
    if (
      error instanceof MissingDatabaseConnectionError &&
      process.env.DATABASE_URL
    ) {
      console.warn(
        'NETLIFY_DB_URL not set; falling back to DATABASE_URL. Use `netlify dev` or set NETLIFY_DB_URL for Netlify Database.'
      );
      return process.env.DATABASE_URL;
    }
    throw error;
  }
}

function sslOptions(connectionString) {
  if (!connectionString) return false;
  if (/localhost|127\.0\.0\.1/.test(connectionString)) return false;
  if (connectionString.includes('sslmode=disable')) return false;
  return { rejectUnauthorized: false };
}

let pool;

if (!global._postgresPool) {
  const connectionString = resolveConnectionString();

  if (!connectionString) {
    console.warn(
      'WARNING: No database connection string configured (NETLIFY_DB_URL).'
    );
  }

  global._postgresPool = new Pool({
    connectionString,
    ssl: sslOptions(connectionString),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

pool = global._postgresPool;

export default pool;

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rowsCount: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}
