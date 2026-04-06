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

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('Seeding database...\n');

    // Seed cgf_info
    console.log('Seeding cgf_info...');
    await client.query(`
      INSERT INTO cgf_info (id, nama_cgf, lokasi_1, lokasi_2, hari) VALUES
      ('CG001', 'CGF Kasih', 'Rumah Andreas - Kemang, Jakarta Selatan', NULL, 'Sabtu'),
      ('CG002', 'CGF Damai', 'Gedung Serbaguna Puri Indah, Jakarta Barat', NULL, 'Minggu'),
      ('CG003', 'CGF Sukacita', 'Rumah Esther - Gading Serpong, Tangerang', NULL, 'Jumat'),
      ('CG004', 'CGF Sabar', 'Rumah Yakobus - Pondok Gede, Bekasi', NULL, 'Sabtu'),
      ('CG005', 'CGF Kemurahan', 'Aula Gereja - Depok', NULL, 'Minggu'),
      ('CG006', 'CGF Kesetiaan', 'Rumah Paulus - Kelapa Gading, Jakarta Utara', NULL, 'Rabu'),
      ('CG007', 'CGF Kerendahan Hati', 'Rumah Samuel - Cilandak, Jakarta Selatan', NULL, 'Sabtu'),
      ('CG008', 'CGF Pengendalian Diri', 'Rumah Timothy - Meruya, Jakarta Barat', NULL, 'Kamis')
      ON CONFLICT (id) DO NOTHING;
    `);

    // Seed cnx_jemaat_clean (members)
    console.log('Seeding cnx_jemaat_clean...');
    await client.query(`
      INSERT INTO cnx_jemaat_clean (no_jemaat, nama_jemaat, jenis_kelamin, tanggal_lahir, tahun_lahir, bulan_lahir, kuliah_kerja, no_handphone, ketertarikan_cgf, nama_cgf, kategori_domisili, alamat_domisili) VALUES
      (1001, 'Andreas Wijaya', 'Laki-laki', '1985-03-15', 1985, 3, 'Kerja', '081234567001', 'Sudah Join', 'CGF Kasih', 'Jakarta Selatan', 'Jl. Kemang Raya No. 12, Mampang Prapatan'),
      (1002, 'Maria Sari', 'Perempuan', '1990-07-22', 1990, 7, 'Kerja', '081234567002', 'Sudah Join', 'CGF Kasih', 'Jakarta Selatan', 'Jl. Panglima Polim No. 45'),
      (1003, 'Daniel Setiawan', 'Laki-laki', '1978-11-05', 1978, 11, 'Kerja', '081234567003', 'Sudah Join', 'CGF Damai', 'Jakarta Barat', 'Jl. Puri Indah No. 8, Kembangan'),
      (1004, 'Sarah Hartono', 'Perempuan', '1995-01-18', 1995, 1, 'Kuliah', '081234567004', 'Sudah Join', 'CGF Damai', 'Jakarta Barat', 'Jl. Kebon Jeruk No. 22'),
      (1005, 'Yohanes Pratama', 'Laki-laki', '2000-05-30', 2000, 5, 'Kuliah', '081234567005', 'Sudah Join', 'CGF Sukacita', 'Tangerang', 'Jl. Gading Serpong Blok A3 No. 10'),
      (1006, 'Esther Lim', 'Perempuan', '1988-09-12', 1988, 9, 'Kerja', '081234567006', 'Sudah Join', 'CGF Sukacita', 'Tangerang', 'Jl. BSD Raya No. 15'),
      (1007, 'Yakobus Santoso', 'Laki-laki', '1972-04-08', 1972, 4, 'Kerja', '081234567007', 'Sudah Join', 'CGF Sabar', 'Bekasi', 'Jl. Jatiwaringin No. 30, Pondok Gede'),
      (1008, 'Ruth Natalia', 'Perempuan', '1993-12-25', 1993, 12, 'Kerja', '081234567008', 'Sudah Join', 'CGF Sabar', 'Bekasi', 'Jl. Kalimalang No. 55'),
      (1009, 'Daud Kurniawan', 'Laki-laki', '1982-06-14', 1982, 6, 'Kerja', '081234567009', 'Sudah Join', 'CGF Kemurahan', 'Depok', 'Jl. Margonda Raya No. 100'),
      (1010, 'Deborah Susanti', 'Perempuan', '1997-02-20', 1997, 2, 'Kuliah', '081234567010', 'Sudah Join', 'CGF Kemurahan', 'Depok', 'Jl. Cijago No. 18')
      ON CONFLICT (no_jemaat) DO NOTHING;
    `);

    // Seed cgf_members
    console.log('Seeding cgf_members...');
    await client.query(`
      INSERT INTO cgf_members (no_jemaat, nama_cgf, is_leader) VALUES
      (1001, 'CGF Kasih', true),
      (1002, 'CGF Kasih', false),
      (1003, 'CGF Damai', true),
      (1004, 'CGF Damai', false),
      (1005, 'CGF Sukacita', true),
      (1006, 'CGF Sukacita', false),
      (1007, 'CGF Sabar', true),
      (1008, 'CGF Sabar', false),
      (1009, 'CGF Kemurahan', true),
      (1010, 'CGF Kemurahan', false)
      ON CONFLICT (no_jemaat, nama_cgf) DO NOTHING;
    `);

    // Seed pelayanan_info
    console.log('Seeding pelayanan_info...');
    await client.query(`
      INSERT INTO pelayanan_info (pelayanan_id, nama_pelayanan) VALUES
      ('P001', 'Worship Leader'),
      ('P002', 'Singer'),
      ('P003', 'Pianist'),
      ('P004', 'Saxophone'),
      ('P005', 'Filler Musician'),
      ('P006', 'Bass Guitarist'),
      ('P007', 'Drummer'),
      ('P008', 'Multimedia'),
      ('P009', 'Sound Engineer'),
      ('P010', 'Caring Team'),
      ('P011', 'Connexion Crew'),
      ('P012', 'Supporting Crew'),
      ('P013', 'CForce'),
      ('P014', 'CG Leader'),
      ('P015', 'Community PIC'),
      ('P016', 'Others')
      ON CONFLICT (pelayanan_id) DO NOTHING;
    `);

    // Seed pelayan (ministry members)
    console.log('Seeding pelayan...');
    await client.query(`
      INSERT INTO pelayan (no_jemaat, nama_jemaat, is_wl, is_singer, is_pianis, is_saxophone, is_filler, is_bass_gitar, is_drum, is_mulmed, is_sound, is_caringteam, is_connexion_crew, is_supporting_crew, is_cforce, is_cg_leader, is_community_pic, is_others, total_pelayanan) VALUES
      (1001, 'Andreas Wijaya', 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 45),
      (1002, 'Maria Sari', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18),
      (1003, 'Daniel Setiawan', 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 52),
      (1004, 'Sarah Hartono', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22),
      (1005, 'Yohanes Pratama', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 38)
      ON CONFLICT (no_jemaat) DO NOTHING;
    `);

    console.log('\nSeeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
