import { Pool, QueryResult, QueryResultRow } from 'pg';
import { config } from './index';

const pool = new Pool({
  connectionString: config.database.url || undefined,
  host: config.database.url ? undefined : config.database.host,
  port: config.database.url ? undefined : config.database.port,
  database: config.database.url ? undefined : config.database.name,
  user: config.database.url ? undefined : config.database.user,
  password: config.database.url ? undefined : config.database.password,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  keepAlive: true,
  keepAliveInitialDelayMillis: 0,
  allowExitOnIdle: true,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(1);
});

function isRetriableError(error: any): boolean {
  if (!error) return false;
  const code = error.code || '';
  const message = error.message || '';
  return (
    code === 'ECONNRESET' ||
    code === 'ECONNREFUSED' ||
    code === 'ETIMEDOUT' ||
    message.includes('Connection terminated') ||
    message.includes('connection closed') ||
    message.includes('read ECONNRESET')
  );
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: unknown[],
  retries = 3,
): Promise<QueryResult<T>> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await pool.query<T>(text, params);
    } catch (error) {
      lastError = error;
      if (isRetriableError(error) && attempt < retries) {
        const backoff = Math.pow(2, attempt) * 100;
        console.warn(`Database query failed, retrying in ${backoff}ms (attempt ${attempt + 1}/${retries})`);
        await delay(backoff);
        continue;
      }
      break;
    }
  }
  console.error('Database query error:', lastError);
  throw lastError;
}

export async function transaction<T>(
  callback: (query: <R extends QueryResultRow = any>(text: string, params?: unknown[]) => Promise<QueryResult<R>>) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Defer foreign key constraint checks until commit time
    await client.query('SET CONSTRAINTS ALL DEFERRED');
    const result = await callback((text, params) => client.query(text, params));
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
