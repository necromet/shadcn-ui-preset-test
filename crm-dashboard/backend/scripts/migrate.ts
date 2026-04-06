import 'dotenv/config';
import { Pool } from 'pg';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'crm_dashboard',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 10000,
});

interface MigrationRow {
  filename: string;
}

async function ensureMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id          SERIAL PRIMARY KEY,
      filename    VARCHAR(255) NOT NULL UNIQUE,
      applied_at  TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(): Promise<string[]> {
  const result = await pool.query<MigrationRow>(
    'SELECT filename FROM _migrations ORDER BY id ASC'
  );
  return result.rows.map((r) => r.filename);
}

function getMigrationFiles(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql') && !f.includes('.rollback.'))
    .sort();
}

async function runMigrations(): Promise<void> {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = getMigrationFiles();

  const pending = files.filter((f) => !applied.includes(f));

  if (pending.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  console.log(`Applying ${pending.length} migration(s)...\n`);

  for (const file of pending) {
    const filePath = join(MIGRATIONS_DIR, file);
    const sql = readFileSync(filePath, 'utf-8');
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(
        'INSERT INTO _migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
        [file]
      );
      await client.query('COMMIT');
      console.log(`  ✓ Applied: ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`  ✗ Failed: ${file}: ${(err as Error).message}`);
      throw err;
    } finally {
      client.release();
    }
  }

  console.log('\nAll migrations applied successfully.');
}

async function rollbackLast(): Promise<void> {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  if (applied.length === 0) {
    console.log('No migrations to rollback.');
    return;
  }

  const lastFile = applied[applied.length - 1];
  console.log(`Rolling back: ${lastFile}`);

  const rollbackFile = lastFile.replace('.sql', '.rollback.sql');
  const rollbackPath = join(MIGRATIONS_DIR, rollbackFile);

  try {
    const sql = readFileSync(rollbackPath, 'utf-8');
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('DELETE FROM _migrations WHERE filename = $1', [lastFile]);
      await client.query('COMMIT');
      console.log(`  ✓ Rolled back: ${lastFile}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`  ✗ Rollback failed: ${(err as Error).message}`);
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`  ✗ No rollback file found: ${rollbackFile}`);
      console.error(`    Please create ${rollbackFile} or use db:reset.`);
    } else {
      throw err;
    }
  }
}

async function showStatus(): Promise<void> {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();
  const files = getMigrationFiles();

  console.log('\nMigration Status:');
  console.log('=================\n');

  for (const file of files) {
    const status = applied.includes(file) ? '  [applied]' : '  [pending]';
    console.log(`${status} ${file}`);
  }

  if (applied.length > 0) {
    const skipped = applied.filter((f) => !files.includes(f));
    for (const file of skipped) {
      console.log(`  [applied] ${file} (file not found)`);
    }
  }

  console.log('');
}

const command = process.argv[2] || 'up';

switch (command) {
  case 'up':
    runMigrations()
      .catch((err) => {
        console.error('Migration failed:', err.message);
        process.exit(1);
      })
      .finally(() => pool.end());
    break;

  case 'down':
    rollbackLast()
      .catch((err) => {
        console.error('Rollback failed:', err.message);
        process.exit(1);
      })
      .finally(() => pool.end());
    break;

  case 'status':
    showStatus()
      .catch((err) => {
        console.error('Status check failed:', err.message);
        process.exit(1);
      })
      .finally(() => pool.end());
    break;

  default:
    console.error(`Unknown command: ${command}`);
    console.error('Usage: tsx scripts/migrate.ts [up|down|status]');
    process.exit(1);
}
