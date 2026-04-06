import { query, transaction } from '../src/config/database';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');

async function ensureMigrationsTable(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id          SERIAL PRIMARY KEY,
      filename    VARCHAR(255) NOT NULL UNIQUE,
      applied_at  TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await query<{ filename: string }>(
    'SELECT filename FROM _migrations ORDER BY id ASC',
  );
  return new Set(result.rows.map((r) => r.filename));
}

async function runMigrations(): Promise<void> {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const pending = files.filter((f) => !applied.has(f));

  if (pending.length === 0) {
    console.log('All migrations already applied.');
    return;
  }

  console.log(`Applying ${pending.length} migration(s)...`);

  for (const file of pending) {
    const sql = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
    const client = await (await import('../src/config/database')).default.connect();

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`  Applied: ${file}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`  Failed: ${file}`);
      throw error;
    } finally {
      client.release();
    }
  }
}

async function rollbackLast(): Promise<void> {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  if (applied.size === 0) {
    console.log('No migrations to rollback.');
    return;
  }

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const appliedList = files.filter((f) => applied.has(f));
  const lastFile = appliedList[appliedList.length - 1];
  const rollbackFile = lastFile.replace('.sql', '.rollback.sql');
  const rollbackPath = join(MIGRATIONS_DIR, rollbackFile);

  try {
    const sql = readFileSync(rollbackPath, 'utf-8');
    const client = await (await import('../src/config/database')).default.connect();

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('DELETE FROM _migrations WHERE filename = $1', [lastFile]);
      await client.query('COMMIT');
      console.log(`  Rolled back: ${lastFile}`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`  Rollback failed: ${lastFile}`);
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`No rollback file found: ${rollbackFile}`);
    } else {
      throw error;
    }
  }
}

async function showStatus(): Promise<void> {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log('\nMigration Status:');
  console.log('─────────────────');
  for (const file of files) {
    const status = applied.has(file) ? '✓ applied' : '○ pending';
    console.log(`  ${status}  ${file}`);
  }
  console.log('');
}

const command = process.argv[2] || 'up';

async function main() {
  switch (command) {
    case 'up':
    case 'migrate':
      await runMigrations();
      break;
    case 'down':
    case 'rollback':
      await rollbackLast();
      break;
    case 'status':
      await showStatus();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      console.error('Usage: tsx scripts/migrate.ts [up|down|status]');
      process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
