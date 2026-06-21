import pool from './db';
import fs from 'fs';
import path from 'path';

let isInitialized = false;

export async function initDatabase() {
  if (isInitialized) return;

  try {
    // Check if players table already exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'players'
      );
    `;
    
    const res = await pool.query(checkTableQuery);
    const tableExists = res.rows[0]?.exists;

    if (!tableExists) {
      console.log('Database tables not found. Initializing schema and seed data...');
      
      // Read schema.sql
      const schemaPath = path.join(process.cwd(), 'lib', 'schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      // Execute schema
      await pool.query(schemaSql);
      console.log('Database successfully initialized and seeded.');
    } else {
      console.log('Database already initialized. Ensuring player colors are available and sequences are synchronized.');
      await pool.query(`ALTER TABLE players ADD COLUMN IF NOT EXISTS color VARCHAR(30) DEFAULT '#64748B';`);
      // Sync sequences to prevent duplicate key constraint violations (e.g., matches_pkey)
      await pool.query(`SELECT setval('matches_id_seq', COALESCE((SELECT MAX(id) FROM matches), 0) + 1, false);`);
      await pool.query(`SELECT setval('players_id_seq', COALESCE((SELECT MAX(id) FROM players), 0) + 1, false);`);
    }
    
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Do not throw to prevent app crashing completely in environments without DB configs yet
  }
}
