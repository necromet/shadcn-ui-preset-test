import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'crm_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 10000,
});

async function inspect() {
  const client = await pool.connect();

  try {
    console.log('Checking cgf_info...');
    const groupsRes = await client.query('SELECT * FROM cgf_info');
    console.log(groupsRes.rows);

    console.log('\nChecking distinct nama_cgf in cgf_members...');
    const membersRes = await client.query('SELECT DISTINCT nama_cgf FROM cgf_members');
    console.log(membersRes.rows);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

inspect();
