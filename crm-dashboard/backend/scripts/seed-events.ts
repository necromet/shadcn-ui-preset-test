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

async function seedEvents() {
  const client = await pool.connect();

  try {
    console.log('Seeding event_history...\n');

    await client.query(`
      INSERT INTO event_history (event_id, event_name, event_date, category, location, description, gcal_event_id, gcal_link, last_synced_at) VALUES
      (1, 'Easter Retreat 2025', '2025-04-18', 'Retreat', 'Villa Istana Bunga, Lembang', 'Retreat Paskah dengan tema "Kebangkitan dan Harapan Baru" selama 3 hari 2 malam', 'gcal_abc123', 'https://calendar.google.com/event?eid=abc123', '2025-04-10T08:00:00Z'),
      (2, 'Worship Night Mei', '2025-05-17', 'Monthly', 'Gedung Gereja Utama', 'Malam pujian dan penyembahan bulanan dengan tema "Berserah"', 'gcal_def456', 'https://calendar.google.com/event?eid=def456', '2025-05-10T09:00:00Z'),
      (3, 'Quarterly Fellowship Q2', '2025-06-14', 'Quarterly', 'Aula Serbaguna Komunitas', 'Fellowship triwulanan dengan games, makan bersama, dan sharing kesaksian', NULL, NULL, NULL),
      (4, 'Youth Camp 2025', '2025-07-04', 'Camp', 'Bumi Perkemahan Cibubur', 'Kemah pemuda selama 4 hari dengan pelatihan kepemimpinan dan ibadah outdoor', 'gcal_ghi789', 'https://calendar.google.com/event?eid=ghi789', '2025-06-28T10:00:00Z'),
      (5, 'Worship Night Agustus', '2025-08-16', 'Monthly', 'Gedung Gereja Utama', 'Malam pujian dengan tema "Kemerdekaan Sejati"', NULL, NULL, NULL),
      (6, 'Quarterly Fellowship Q3', '2025-09-13', 'Quarterly', 'Aula Serbaguna Komunitas', 'Fellowship triwulanan dengan acara bakar-bakar dan sharing pelayanan', 'gcal_jkl012', 'https://calendar.google.com/event?eid=jkl012', '2025-09-05T11:00:00Z'),
      (7, 'Family Retreat 2025', '2025-10-03', 'Retreat', 'Hotel Puncak Pass Resort', 'Retreat keluarga dengan sesi parenting dan family bonding', 'gcal_mno345', 'https://calendar.google.com/event?eid=mno345', '2025-09-25T08:00:00Z'),
      (8, 'Worship Night November', '2025-11-15', 'Monthly', 'Gedung Gereja Utama', 'Malam pujian dengan tema "Syukur dan Pengharapan"', NULL, NULL, NULL),
      (9, 'Christmas Service 2025', '2025-12-24', 'Special', 'Gedung Gereja Utama', 'Ibadah Natal dengan drama, paduan suara, dan perayaan kelahiran Kristus', 'gcal_pqr678', 'https://calendar.google.com/event?eid=pqr678', '2025-12-15T09:00:00Z'),
      (10, 'New Year Revival 2026', '2026-01-01', 'Special', 'Gedung Gereja Utama', 'Ibadah pergantian tahun dengan doa syafaat dan komitmen baru', 'gcal_stu901', 'https://calendar.google.com/event?eid=stu901', '2025-12-28T10:00:00Z'),
      (11, 'Quarterly Fellowship Q1 2026', '2026-01-17', 'Quarterly', 'Aula Serbaguna Komunitas', 'Fellowship triwulanan awal tahun dengan visi dan tujuan 2026', NULL, NULL, NULL),
      (12, 'Worship Night Februari', '2026-02-14', 'Monthly', 'Gedung Gereja Utama', 'Malam pujian kasih dengan tema "Kasih yang Memulihkan"', 'gcal_vwx234', 'https://calendar.google.com/event?eid=vwx234', '2026-02-08T08:00:00Z'),
      (13, 'Easter Retreat 2026', '2026-04-03', 'Retreat', 'Villa Istana Bunga, Lembang', 'Retreat Paskah dengan tema "Hidup Baru dalam Kristus"', 'gcal_yza567', 'https://calendar.google.com/event?eid=yza567', '2026-03-28T09:00:00Z'),
      (14, 'Worship Night Maret', '2026-03-14', 'Monthly', 'Gedung Gereja Utama', 'Malam pujian dengan tema "Iman yang Teguh"', 'gcal_bcd890', 'https://calendar.google.com/event?eid=bcd890', '2026-03-08T10:00:00Z'),
      (15, 'Quarterly Fellowship Q2 2026', '2026-04-18', 'Quarterly', 'Aula Serbaguna Komunitas', 'Fellowship triwulanan Q2 dengan tema "Pertumbuhan Bersama"', NULL, NULL, NULL),
      (16, 'Prayer Breakfast', '2026-04-04', 'Monthly', 'Gedung Gereja Utama', 'Sarapan doa bersama untuk memulai bulan April dengan syukur', 'gcal_efg111', 'https://calendar.google.com/event?eid=efg111', '2026-03-30T08:00:00Z'),
      (17, 'Community Service Day', '2026-04-05', 'Special', 'RPTRA Kalijodo', 'Pelayanan komunitas membersihkan taman dan berbagi kasih dengan warga sekitar', NULL, NULL, NULL),
      (18, 'Youth Gathering', '2026-04-06', 'Monthly', 'Cafe Grace, Kemang', 'Pertemuan pemuda dengan diskusi dan fellowship santai', 'gcal_hij222', 'https://calendar.google.com/event?eid=hij222', '2026-04-01T07:00:00Z'),
      (19, 'CGF Leaders Meeting', '2026-04-08', 'Quarterly', 'Ruang Rapat Gereja Lt. 2', 'Rapat koordinasi pemimpin CGF untuk program Q2 2026', NULL, NULL, NULL)
      ON CONFLICT (event_id) DO UPDATE SET
        event_name = EXCLUDED.event_name,
        event_date = EXCLUDED.event_date,
        category = EXCLUDED.category,
        location = EXCLUDED.location,
        description = EXCLUDED.description,
        gcal_event_id = EXCLUDED.gcal_event_id,
        gcal_link = EXCLUDED.gcal_link,
        last_synced_at = EXCLUDED.last_synced_at;
    `);

    console.log('event_history seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedEvents()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
