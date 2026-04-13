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

async function populateAttendance() {
  const client = await pool.connect();

  try {
    console.log('Populating cgf_attendance...\n');

    // 1. Fetch CGF Groups and Members
    console.log('Fetching CGF groups and members...');
    const groupsRes = await client.query('SELECT id, nama_cgf, hari FROM cgf_info');
    const membersRes = await client.query('SELECT no_jemaat, nama_cgf FROM cgf_members');

    const groups = groupsRes.rows;
    const members = membersRes.rows;

    console.log(`Found ${groups.length} groups and ${members.length} members.`);

    if (groups.length === 0 || members.length === 0) {
      console.log('No groups or members found. Please seed the database first.');
      return;
    }

    // Map members to groups for quick lookup
    const groupMembersMap: { [key: string]: number[] } = {};
    groups.forEach(g => {
      groupMembersMap[g.id] = [];
      console.log(`Group ${g.id} (${g.nama_cgf}) meets on ${g.hari}`);
    });
    members.forEach(m => {
      // Find group ID by name
      const group = groups.find(g => g.nama_cgf === m.nama_cgf);
      if (group) {
        groupMembersMap[group.id].push(m.no_jemaat);
      }
    });

    // 2. Generate attendance records for the last 12 weeks (approx 3 months)
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 84); // 12 weeks ago

    const dates: string[] = [];
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    console.log(`Generating attendance for ${dates.length} days...`);

    let insertedCount = 0;
    const keteranganOptions: ('hadir' | 'izin' | 'tidak_hadir' | 'tamu')[] = ['hadir', 'izin', 'tidak_hadir', 'tamu'];

    // Use a transaction for batch inserts
    await client.query('BEGIN');

    for (const dateStr of dates) {
      const date = new Date(dateStr);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayName = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][dayOfWeek];

      for (const group of groups) {
        // Only add attendance if the group meets on this day
        if (group.hari !== dayName) continue;

        const groupMembers = groupMembersMap[group.id];
        if (!groupMembers || groupMembers.length === 0) continue;

        for (const noJemaat of groupMembers) {
          // Generate random attendance status
          const rand = Math.random();
          let keterangan: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
          if (rand < 0.8) keterangan = 'hadir';
          else if (rand < 0.9) keterangan = 'izin';
          else if (rand < 0.95) keterangan = 'tidak_hadir';
          else keterangan = 'tamu';

          try {
            await client.query(
              `INSERT INTO cgf_attendance (no_jemaat, cg_id, tanggal, keterangan)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (no_jemaat, cg_id, tanggal) DO NOTHING`,
              [noJemaat, group.id, dateStr, keterangan]
            );
            insertedCount++;
          } catch (err) {
            console.error(`Error inserting attendance for member ${noJemaat} on ${dateStr}:`, err);
          }
        }
      }
    }

    await client.query('COMMIT');
    console.log(`\nSuccessfully populated ${insertedCount} attendance records.`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to populate attendance:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

populateAttendance()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
