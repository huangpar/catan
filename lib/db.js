import { Pool } from 'pg';

let pool;

if (!global._postgresPool) {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.warn("WARNING: DATABASE_URL environment variable is not defined.");
  }

  global._postgresPool = new Pool({
    connectionString: connectionString,
    ssl: connectionString && connectionString.includes('sslmode=require') || connectionString?.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : false,
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
