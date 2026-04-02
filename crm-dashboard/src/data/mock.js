// Church Management Dashboard - Mock Data
// Data model based on PostgreSQL tables: cnx_jemaat_clean, cgf_info, cgf_members, cgf_attendance

// ============================================================
// UTILITY HELPERS
// ============================================================

const GENDERS = ['Laki-laki', 'Perempuan'];
const DOMISILI_AREAS = ['Jakarta Selatan', 'Jakarta Barat', 'Jakarta Utara', 'Tangerang', 'Bekasi', 'Depok'];
const CGF_INTEREST = ['Sudah Join', 'Belum Join', 'Tertarik'];
const KULIAH_KERJA = ['Kuliah', 'Kerja'];
const ATTENDANCE_STATUS = ['hadir', 'izin', 'tidak_hadir', 'tamu'];
const CGF_NAMES = [
  'CGF Kasih', 'CGF Damai', 'CGF Sukacita', 'CGF Sabar',
  'CGF Kemurahan', 'CGF Kesetiaan', 'CGF Kerendahan Hati', 'CGF Pengendalian Diri'
];

function randomDate(start, end) {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString().split('T')[0];
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone() {
  const prefix = randomItem(['0812', '0813', '0821', '0822', '0856', '0857', '0858', '0878']);
  const digits = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${digits}`;
}

// ============================================================
// MOCK DATA - MEMBERS (cnx_jemaat_clean)
// ============================================================

const members = [
  { no_jemaat: 1001, nama_jemaat: 'Andreas Wijaya', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1985-03-15', tahun_lahir: 1985, bulan_lahir: 3, kuliah_kerja: 'Kerja', no_handphone: '081234567001', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kasih', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Kemang Raya No. 12, Mampang Prapatan' },
  { no_jemaat: 1002, nama_jemaat: 'Maria Sari', jenis_kelamin: 'Perempuan', tanggal_lahir: '1990-07-22', tahun_lahir: 1990, bulan_lahir: 7, kuliah_kerja: 'Kerja', no_handphone: '081234567002', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kasih', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Panglima Polim No. 45' },
  { no_jemaat: 1003, nama_jemaat: 'Daniel Setiawan', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1978-11-05', tahun_lahir: 1978, bulan_lahir: 11, kuliah_kerja: 'Kerja', no_handphone: '081234567003', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Damai', kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Puri Indah No. 8, Kembangan' },
  { no_jemaat: 1004, nama_jemaat: 'Sarah Hartono', jenis_kelamin: 'Perempuan', tanggal_lahir: '1995-01-18', tahun_lahir: 1995, bulan_lahir: 1, kuliah_kerja: 'Kuliah', no_handphone: '081234567004', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Damai', kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Kebon Jeruk No. 22' },
  { no_jemaat: 1005, nama_jemaat: 'Yohanes Pratama', jenis_kelamin: 'Laki-laki', tanggal_lahir: '2000-05-30', tahun_lahir: 2000, bulan_lahir: 5, kuliah_kerja: 'Kuliah', no_handphone: '081234567005', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sukacita', kategori_domisili: 'Tangerang', alamat_domisili: 'Jl. Gading Serpong Blok A3 No. 10' },
  { no_jemaat: 1006, nama_jemaat: 'Esther Lim', jenis_kelamin: 'Perempuan', tanggal_lahir: '1988-09-12', tahun_lahir: 1988, bulan_lahir: 9, kuliah_kerja: 'Kerja', no_handphone: '081234567006', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sukacita', kategori_domisili: 'Tangerang', alamat_domisili: 'Jl. BSD Raya No. 15' },
  { no_jemaat: 1007, nama_jemaat: 'Yakobus Santoso', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1972-04-08', tahun_lahir: 1972, bulan_lahir: 4, kuliah_kerja: 'Kerja', no_handphone: '081234567007', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sabar', kategori_domisili: 'Bekasi', alamat_domisili: 'Jl. Jatiwaringin No. 30, Pondok Gede' },
  { no_jemaat: 1008, nama_jemaat: 'Ruth Natalia', jenis_kelamin: 'Perempuan', tanggal_lahir: '1993-12-25', tahun_lahir: 1993, bulan_lahir: 12, kuliah_kerja: 'Kerja', no_handphone: '081234567008', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sabar', kategori_domisili: 'Bekasi', alamat_domisili: 'Jl. Kalimalang No. 55' },
  { no_jemaat: 1009, nama_jemaat: 'Daud Kurniawan', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1982-06-14', tahun_lahir: 1982, bulan_lahir: 6, kuliah_kerja: 'Kerja', no_handphone: '081234567009', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kemurahan', kategori_domisili: 'Depok', alamat_domisili: 'Jl. Margonda Raya No. 100' },
  { no_jemaat: 1010, nama_jemaat: 'Deborah Susanti', jenis_kelamin: 'Perempuan', tanggal_lahir: '1997-02-20', tahun_lahir: 1997, bulan_lahir: 2, kuliah_kerja: 'Kuliah', no_handphone: '081234567010', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kemurahan', kategori_domisili: 'Depok', alamat_domisili: 'Jl. Cijago No. 18' },
  { no_jemaat: 1011, nama_jemaat: 'Paulus Gunawan', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1975-10-03', tahun_lahir: 1975, bulan_lahir: 10, kuliah_kerja: 'Kerja', no_handphone: '081234567011', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kesetiaan', kategori_domisili: 'Jakarta Utara', alamat_domisili: 'Jl. Kelapa Gading No. 77' },
  { no_jemaat: 1012, nama_jemaat: 'Hana Wijayanti', jenis_kelamin: 'Perempuan', tanggal_lahir: '1991-08-09', tahun_lahir: 1991, bulan_lahir: 8, kuliah_kerja: 'Kerja', no_handphone: '081234567012', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kesetiaan', kategori_domisili: 'Jakarta Utara', alamat_domisili: 'Jl. Pluit Karang Ayu No. 5' },
  { no_jemaat: 1013, nama_jemaat: 'Samuel Tan', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1999-03-17', tahun_lahir: 1999, bulan_lahir: 3, kuliah_kerja: 'Kuliah', no_handphone: '081234567013', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kerendahan Hati', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Cilandak No. 33' },
  { no_jemaat: 1014, nama_jemaat: 'Grace Oktavia', jenis_kelamin: 'Perempuan', tanggal_lahir: '1994-11-28', tahun_lahir: 1994, bulan_lahir: 11, kuliah_kerja: 'Kerja', no_handphone: '081234567014', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kerendahan Hati', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Lebak Bulus I No. 12' },
  { no_jemaat: 1015, nama_jemaat: 'Timothy Halim', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1987-01-06', tahun_lahir: 1987, bulan_lahir: 1, kuliah_kerja: 'Kerja', no_handphone: '081234567015', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Pengendalian Diri', kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Meruya No. 44' },
  { no_jemaat: 1016, nama_jemaat: 'Mikhaela Tampubolon', jenis_kelamin: 'Perempuan', tanggal_lahir: '1983-05-19', tahun_lahir: 1983, bulan_lahir: 5, kuliah_kerja: 'Kerja', no_handphone: '081234567016', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Pengendalian Diri', kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Daan Mogot Km. 12 No. 8' },
  { no_jemaat: 1017, nama_jemaat: 'Gabriel Saputra', jenis_kelamin: 'Laki-laki', tanggal_lahir: '2001-04-11', tahun_lahir: 2001, bulan_lahir: 4, kuliah_kerja: 'Kuliah', no_handphone: '081234567017', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kasih', kategori_domisili: 'Tangerang', alamat_domisili: 'Jl. Alam Sutera No. 19' },
  { no_jemaat: 1018, nama_jemaat: 'Brenda Anggraini', jenis_kelamin: 'Perempuan', tanggal_lahir: '1998-06-23', tahun_lahir: 1998, bulan_lahir: 6, kuliah_kerja: 'Kuliah', no_handphone: '081234567018', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Damai', kategori_domisili: 'Jakarta Utara', alamat_domisili: 'Jl. Sunter Agung No. 28' },
  { no_jemaat: 1019, nama_jemaat: 'Michael Putra', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1979-12-01', tahun_lahir: 1979, bulan_lahir: 12, kuliah_kerja: 'Kerja', no_handphone: '081234567019', ketertarikan_cgf: 'Tertarik', nama_cgf: null, kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Fatmawati No. 67' },
  { no_jemaat: 1020, nama_jemaat: 'Catherine Widodo', jenis_kelamin: 'Perempuan', tanggal_lahir: '1992-03-07', tahun_lahir: 1992, bulan_lahir: 3, kuliah_kerja: 'Kerja', no_handphone: '081234567020', ketertarikan_cgf: 'Tertarik', nama_cgf: null, kategori_domisili: 'Depok', alamat_domisili: 'Jl. Cinere Raya No. 40' },
  { no_jemaat: 1021, nama_jemaat: 'Ezra Nugroho', jenis_kelamin: 'Laki-laki', tanggal_lahir: '2003-08-15', tahun_lahir: 2003, bulan_lahir: 8, kuliah_kerja: 'Kuliah', no_handphone: '081234567021', ketertarikan_cgf: 'Tertarik', nama_cgf: null, kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Green Garden No. 11' },
  { no_jemaat: 1022, nama_jemaat: 'Abigail Larasati', jenis_kelamin: 'Perempuan', tanggal_lahir: '2001-09-30', tahun_lahir: 2001, bulan_lahir: 9, kuliah_kerja: 'Kuliah', no_handphone: '081234567022', ketertarikan_cgf: 'Belum Join', nama_cgf: null, kategori_domisili: 'Bekasi', alamat_domisili: 'Jl. Harapan Indah No. 25' },
  { no_jemaat: 1023, nama_jemaat: 'Natan Ridwan', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1960-02-14', tahun_lahir: 1960, bulan_lahir: 2, kuliah_kerja: 'Kerja', no_handphone: '081234567023', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sukacita', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Blok M Square No. 3' },
  { no_jemaat: 1024, nama_jemaat: 'Lidia Purnamasari', jenis_kelamin: 'Perempuan', tanggal_lahir: '1958-07-08', tahun_lahir: 1958, bulan_lahir: 7, kuliah_kerja: 'Kerja', no_handphone: '081234567024', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sabar', kategori_domisili: 'Jakarta Utara', alamat_domisili: 'Jl. Pantai Indah Kapuk No. 9' },
  { no_jemaat: 1025, nama_jemaat: 'Imanuel Sihombing', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1965-11-21', tahun_lahir: 1965, bulan_lahir: 11, kuliah_kerja: 'Kerja', no_handphone: '081234567025', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kesetiaan', kategori_domisili: 'Bekasi', alamat_domisili: 'Jl. Galaxy No. 18' },
  { no_jemaat: 1026, nama_jemaat: 'Kirenius Sagala', jenis_kelamin: 'Laki-laki', tanggal_lahir: '2002-04-03', tahun_lahir: 2002, bulan_lahir: 4, kuliah_kerja: 'Kuliah', no_handphone: '081234567026', ketertarikan_cgf: 'Belum Join', nama_cgf: null, kategori_domisili: 'Tangerang', alamat_domisili: 'Jl. Ciputat No. 60' },
  { no_jemaat: 1027, nama_jemaat: 'Naomi Simanjuntak', jenis_kelamin: 'Perempuan', tanggal_lahir: '1986-01-29', tahun_lahir: 1986, bulan_lahir: 1, kuliah_kerja: 'Kerja', no_handphone: '081234567027', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kerendahan Hati', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Senayan No. 2' },
  { no_jemaat: 1028, nama_jemaat: 'Obed Manurung', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1970-06-16', tahun_lahir: 1970, bulan_lahir: 6, kuliah_kerja: 'Kerja', no_handphone: '081234567028', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kemurahan', kategori_domisili: 'Depok', alamat_domisili: 'Jl. Sawangan No. 70' },
  { no_jemaat: 1029, nama_jemaat: 'Priscilla Anggraeni', jenis_kelamin: 'Perempuan', tanggal_lahir: '1996-10-10', tahun_lahir: 1996, bulan_lahir: 10, kuliah_kerja: 'Kerja', no_handphone: '081234567029', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Pengendalian Diri', kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Tomang No. 35' },
  { no_jemaat: 1030, nama_jemaat: 'Rafael Hutapea', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1994-02-28', tahun_lahir: 1994, bulan_lahir: 2, kuliah_kerja: 'Kerja', no_handphone: '081234567030', ketertarikan_cgf: 'Belum Join', nama_cgf: null, kategori_domisili: 'Jakarta Utara', alamat_domisili: 'Jl. Ancol Timur No. 14' },
  { no_jemaat: 1031, nama_jemaat: 'Sela Marpaung', jenis_kelamin: 'Perempuan', tanggal_lahir: '1976-05-05', tahun_lahir: 1976, bulan_lahir: 5, kuliah_kerja: 'Kerja', no_handphone: '081234567031', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kasih', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Cipete Raya No. 50' },
  { no_jemaat: 1032, nama_jemaat: 'Titus Sibarani', jenis_kelamin: 'Laki-laki', tanggal_lahir: '2004-12-12', tahun_lahir: 2004, bulan_lahir: 12, kuliah_kerja: 'Kuliah', no_handphone: '081234567032', ketertarikan_cgf: 'Tertarik', nama_cgf: null, kategori_domisili: 'Bekasi', alamat_domisili: 'Jl. Bintara No. 42' },
  { no_jemaat: 1033, nama_jemaat: 'Ulfa Ramadhani', jenis_kelamin: 'Perempuan', tanggal_lahir: '1999-09-19', tahun_lahir: 1999, bulan_lahir: 9, kuliah_kerja: 'Kuliah', no_handphone: '081234567033', ketertarikan_cgf: 'Belum Join', nama_cgf: null, kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Srengseng No. 20' },
  { no_jemaat: 1034, nama_jemaat: 'Viktor Nainggolan', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1955-03-23', tahun_lahir: 1955, bulan_lahir: 3, kuliah_kerja: 'Kerja', no_handphone: '081234567034', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Damai', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Radio Dalam No. 7' },
  { no_jemaat: 1035, nama_jemaat: 'Wisye Pakpahan', jenis_kelamin: 'Perempuan', tanggal_lahir: '1962-08-15', tahun_lahir: 1962, bulan_lahir: 8, kuliah_kerja: 'Kerja', no_handphone: '081234567035', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sukacita', kategori_domisili: 'Tangerang', alamat_domisili: 'Jl. Serpong Utara No. 55' },
];

// ============================================================
// MOCK DATA - CGF GROUPS (cgf_info)
// ============================================================

const cgfGroups = [
  { cg_id: 1, nama_cgf: 'CGF Kasih', leader_name: 'Andreas Wijaya', jadwal: 'Setiap Sabtu, 18:00 WIB', lokasi: 'Rumah Andreas - Kemang, Jakarta Selatan', created_at: '2023-01-15T10:00:00Z' },
  { cg_id: 2, nama_cgf: 'CGF Damai', leader_name: 'Daniel Setiawan', jadwal: 'Setiap Minggu, 10:00 WIB', lokasi: 'Gedung Serbaguna Puri Indah, Jakarta Barat', created_at: '2023-02-01T10:00:00Z' },
  { cg_id: 3, nama_cgf: 'CGF Sukacita', leader_name: 'Yohanes Pratama', jadwal: 'Setiap Jumat, 19:00 WIB', lokasi: 'Rumah Esther - Gading Serpong, Tangerang', created_at: '2023-02-20T10:00:00Z' },
  { cg_id: 4, nama_cgf: 'CGF Sabar', leader_name: 'Yakobus Santoso', jadwal: 'Setiap Sabtu, 17:00 WIB', lokasi: 'Rumah Yakobus - Pondok Gede, Bekasi', created_at: '2023-03-10T10:00:00Z' },
  { cg_id: 5, nama_cgf: 'CGF Kemurahan', leader_name: 'Daud Kurniawan', jadwal: 'Setiap Minggu, 15:00 WIB', lokasi: 'Aula Gereja - Depok', created_at: '2023-04-05T10:00:00Z' },
  { cg_id: 6, nama_cgf: 'CGF Kesetiaan', leader_name: 'Paulus Gunawan', jadwal: 'Setiap Rabu, 19:30 WIB', lokasi: 'Rumah Paulus - Kelapa Gading, Jakarta Utara', created_at: '2023-05-01T10:00:00Z' },
  { cg_id: 7, nama_cgf: 'CGF Kerendahan Hati', leader_name: 'Samuel Tan', jadwal: 'Setiap Sabtu, 16:00 WIB', lokasi: 'Rumah Samuel - Cilandak, Jakarta Selatan', created_at: '2023-06-15T10:00:00Z' },
  { cg_id: 8, nama_cgf: 'CGF Pengendalian Diri', leader_name: 'Timothy Halim', jadwal: 'Setiap Kamis, 19:00 WIB', lokasi: 'Rumah Timothy - Meruya, Jakarta Barat', created_at: '2023-07-20T10:00:00Z' },
];

// ============================================================
// MOCK DATA - CGF MEMBERS ASSIGNMENTS (cgf_members)
// ============================================================

const cgfMembers = [
  { id: 1, no_jemaat: 1001, cg_id: 1, is_leader: true },
  { id: 2, no_jemaat: 1002, cg_id: 1, is_leader: false },
  { id: 3, no_jemaat: 1017, cg_id: 1, is_leader: false },
  { id: 4, no_jemaat: 1031, cg_id: 1, is_leader: false },
  { id: 5, no_jemaat: 1003, cg_id: 2, is_leader: true },
  { id: 6, no_jemaat: 1004, cg_id: 2, is_leader: false },
  { id: 7, no_jemaat: 1018, cg_id: 2, is_leader: false },
  { id: 8, no_jemaat: 1034, cg_id: 2, is_leader: false },
  { id: 9, no_jemaat: 1005, cg_id: 3, is_leader: true },
  { id: 10, no_jemaat: 1006, cg_id: 3, is_leader: false },
  { id: 11, no_jemaat: 1023, cg_id: 3, is_leader: false },
  { id: 12, no_jemaat: 1035, cg_id: 3, is_leader: false },
  { id: 13, no_jemaat: 1007, cg_id: 4, is_leader: true },
  { id: 14, no_jemaat: 1008, cg_id: 4, is_leader: false },
  { id: 15, no_jemaat: 1024, cg_id: 4, is_leader: false },
  { id: 16, no_jemaat: 1009, cg_id: 5, is_leader: true },
  { id: 17, no_jemaat: 1010, cg_id: 5, is_leader: false },
  { id: 18, no_jemaat: 1028, cg_id: 5, is_leader: false },
  { id: 19, no_jemaat: 1011, cg_id: 6, is_leader: true },
  { id: 20, no_jemaat: 1012, cg_id: 6, is_leader: false },
  { id: 21, no_jemaat: 1025, cg_id: 6, is_leader: false },
  { id: 22, no_jemaat: 1013, cg_id: 7, is_leader: true },
  { id: 23, no_jemaat: 1014, cg_id: 7, is_leader: false },
  { id: 24, no_jemaat: 1027, cg_id: 7, is_leader: false },
  { id: 25, no_jemaat: 1015, cg_id: 8, is_leader: true },
  { id: 26, no_jemaat: 1016, cg_id: 8, is_leader: false },
  { id: 27, no_jemaat: 1029, cg_id: 8, is_leader: false },
];

// ============================================================
// MOCK DATA - ATTENDANCE RECORDS (cgf_attendance)
// Past 3 months: February, March, April 2026
// ============================================================

function generateAttendanceRecords() {
  const records = [];
  let id = 1;
  const now = new Date('2026-04-02');

  // Generate 12 weeks of attendance data (weekly meetings)
  for (let weekOffset = 0; weekOffset < 12; weekOffset++) {
    const meetingDate = new Date(now);
    meetingDate.setDate(meetingDate.getDate() - (weekOffset * 7));

    // Each CGF has a meeting this week
    for (const group of cgfGroups) {
      // Get members of this group
      const groupMembers = cgfMembers.filter(cm => cm.cg_id === group.cg_id);

      for (const member of groupMembers) {
        // Randomly determine attendance status with weighted probability
        const rand = Math.random();
        let keterangan;
        if (rand < 0.65) keterangan = 'hadir';
        else if (rand < 0.78) keterangan = 'izin';
        else if (rand < 0.92) keterangan = 'tidak_hadir';
        else keterangan = 'tamu';

        records.push({
          id: id++,
          no_jemaat: member.no_jemaat,
          cg_id: group.cg_id,
          tanggal: meetingDate.toISOString().split('T')[0],
          keterangan,
        });
      }

      // Occasionally add a guest (tamu) who is not a member
      if (Math.random() < 0.15) {
        const nonMembers = members.filter(
          m => !cgfMembers.some(cm => cm.no_jemaat === m.no_jemaat)
        );
        if (nonMembers.length > 0) {
          const guest = randomItem(nonMembers);
          records.push({
            id: id++,
            no_jemaat: guest.no_jemaat,
            cg_id: group.cg_id,
            tanggal: meetingDate.toISOString().split('T')[0],
            keterangan: 'tamu',
          });
        }
      }
    }
  }

  return records.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
}

const cgfAttendance = generateAttendanceRecords();

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getMembers() {
  return [...members];
}

function getMemberById(no_jemaat) {
  return members.find(m => m.no_jemaat === no_jemaat) || null;
}

function getCGFGroups() {
  return [...cgfGroups];
}

function getCGFGroupById(cg_id) {
  return cgfGroups.find(g => g.cg_id === cg_id) || null;
}

function getCGFMembers(cg_id) {
  const assignments = cgfMembers.filter(cm => cm.cg_id === cg_id);
  return assignments.map(assignment => {
    const member = members.find(m => m.no_jemaat === assignment.no_jemaat);
    return {
      ...member,
      is_leader: assignment.is_leader,
      cg_id: assignment.cg_id,
    };
  });
}

function getAttendance(filters = {}) {
  let result = [...cgfAttendance];

  if (filters.no_jemaat !== undefined) {
    result = result.filter(r => r.no_jemaat === filters.no_jemaat);
  }

  if (filters.cg_id !== undefined) {
    result = result.filter(r => r.cg_id === filters.cg_id);
  }

  if (filters.keterangan !== undefined) {
    result = result.filter(r => r.keterangan === filters.keterangan);
  }

  if (filters.startDate !== undefined) {
    result = result.filter(r => r.tanggal >= filters.startDate);
  }

  if (filters.endDate !== undefined) {
    result = result.filter(r => r.tanggal <= filters.endDate);
  }

  return result;
}

function getDashboardKPIs() {
  const totalMembers = members.length;
  const totalCGFGroups = cgfGroups.length;
  const membersWithoutCGF = members.filter(m => m.ketertarikan_cgf !== 'Sudah Join').length;

  // Current month attendance rate (March 2026)
  const currentMonthStart = '2026-03-01';
  const currentMonthEnd = '2026-03-31';
  const currentMonthAttendance = cgfAttendance.filter(
    r => r.tanggal >= currentMonthStart && r.tanggal <= currentMonthEnd
  );
  const hadirCount = currentMonthAttendance.filter(r => r.keterangan === 'hadir').length;
  const attendanceRateCurrentMonth = currentMonthAttendance.length > 0
    ? Math.round((hadirCount / currentMonthAttendance.length) * 100)
    : 0;

  return {
    totalMembers,
    totalCGFGroups,
    membersWithoutCGF,
    attendanceRateCurrentMonth,
  };
}

function getGenderDistribution() {
  const male = members.filter(m => m.jenis_kelamin === 'Laki-laki').length;
  const female = members.filter(m => m.jenis_kelamin === 'Perempuan').length;
  return { male, female };
}

function getAgeDistribution() {
  const currentYear = 2026;
  const distribution = { '10s': 0, '20s': 0, '30s': 0, '40s': 0, '50s': 0, '60s+': 0 };

  members.forEach(m => {
    const age = currentYear - m.tahun_lahir;
    if (age < 20) distribution['10s']++;
    else if (age < 30) distribution['20s']++;
    else if (age < 40) distribution['30s']++;
    else if (age < 50) distribution['40s']++;
    else if (age < 60) distribution['50s']++;
    else distribution['60s+']++;
  });

  return distribution;
}

function getDomisiliDistribution() {
  const distribution = {};
  DOMISILI_AREAS.forEach(area => {
    distribution[area] = members.filter(m => m.kategori_domisili === area).length;
  });
  return distribution;
}

function getCGFSizes() {
  return cgfGroups.map(group => {
    const size = cgfMembers.filter(cm => cm.cg_id === group.cg_id).length;
    return {
      cg_id: group.cg_id,
      nama_cgf: group.nama_cgf,
      memberCount: size,
    };
  });
}

function getAttendanceTrend() {
  const now = new Date('2026-04-02');
  const weeklyData = [];

  for (let weekOffset = 11; weekOffset >= 0; weekOffset--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - (weekOffset * 7));
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];

    const weekAttendance = cgfAttendance.filter(r => r.tanggal >= weekStartStr && r.tanggal <= weekEndStr);
    const hadir = weekAttendance.filter(r => r.keterangan === 'hadir').length;
    const tidakHadir = weekAttendance.filter(r => r.keterangan === 'tidak_hadir').length;
    const izin = weekAttendance.filter(r => r.keterangan === 'izin').length;
    const tamu = weekAttendance.filter(r => r.keterangan === 'tamu').length;

    weeklyData.push({
      weekLabel: `Minggu ${12 - weekOffset}`,
      weekStart: weekStartStr,
      weekEnd: weekEndStr,
      hadir,
      tidakHadir,
      izin,
      tamu,
      total: weekAttendance.length,
    });
  }

  return weeklyData;
}

function getCGFInterestFunnel() {
  const tertarik = members.filter(m => m.ketertarikan_cgf === 'Tertarik').length;
  const belumJoin = members.filter(m => m.ketertarikan_cgf === 'Belum Join').length;
  const sudahJoin = members.filter(m => m.ketertarikan_cgf === 'Sudah Join').length;
  return { tertarik, belumJoin, sudahJoin };
}

function getKuliahKerjaRatio() {
  const kuliah = members.filter(m => m.kuliah_kerja === 'Kuliah').length;
  const kerja = members.filter(m => m.kuliah_kerja === 'Kerja').length;
  return { kuliah, kerja };
}

function getBirthdayMembers() {
  const currentMonth = 4; // April
  return members.filter(m => m.bulan_lahir === currentMonth);
}

// ============================================================
// EXPORTS
// ============================================================

export {
  // Raw data
  members,
  cgfGroups,
  cgfMembers,
  cgfAttendance,

  // Constants
  GENDERS,
  DOMISILI_AREAS,
  CGF_INTEREST,
  KULIAH_KERJA,
  ATTENDANCE_STATUS,
  CGF_NAMES,

  // Helper functions
  getMembers,
  getMemberById,
  getCGFGroups,
  getCGFGroupById,
  getCGFMembers,
  getAttendance,
  getDashboardKPIs,
  getGenderDistribution,
  getAgeDistribution,
  getDomisiliDistribution,
  getCGFSizes,
  getAttendanceTrend,
  getCGFInterestFunnel,
  getKuliahKerjaRatio,
  getBirthdayMembers,
};