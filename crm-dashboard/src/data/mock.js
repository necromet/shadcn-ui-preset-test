// Church Management Dashboard - Mock Data
// Data model based on PostgreSQL tables: cnx_jemaat_clean, cgf_info, cgf_members, cgf_attendance

// ============================================================
// UTILITY HELPERS
// ============================================================

const API_BASE = import.meta.env.VITE_API_URL;
const GENDERS = ['Laki-laki', 'Perempuan'];
const DOMISILI_AREAS = ['Jakarta Selatan', 'Jakarta Barat', 'Jakarta Utara', 'Tangerang', 'Bekasi', 'Depok'];
const CGF_INTEREST = ['Belum Mau Join', 'Mau Join', 'Sudah Join', 'Sudah Tidak Join'];
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
  { no_jemaat: 1019, nama_jemaat: 'Michael Putra', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1979-12-01', tahun_lahir: 1979, bulan_lahir: 12, kuliah_kerja: 'Kerja', no_handphone: '081234567019', ketertarikan_cgf: 'Mau Join', nama_cgf: null, kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Fatmawati No. 67' },
  { no_jemaat: 1020, nama_jemaat: 'Catherine Widodo', jenis_kelamin: 'Perempuan', tanggal_lahir: '1992-03-07', tahun_lahir: 1992, bulan_lahir: 3, kuliah_kerja: 'Kerja', no_handphone: '081234567020', ketertarikan_cgf: 'Mau Join', nama_cgf: null, kategori_domisili: 'Depok', alamat_domisili: 'Jl. Cinere Raya No. 40' },
  { no_jemaat: 1021, nama_jemaat: 'Ezra Nugroho', jenis_kelamin: 'Laki-laki', tanggal_lahir: '2003-08-15', tahun_lahir: 2003, bulan_lahir: 8, kuliah_kerja: 'Kuliah', no_handphone: '081234567021', ketertarikan_cgf: 'Mau Join', nama_cgf: null, kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Green Garden No. 11' },
  { no_jemaat: 1022, nama_jemaat: 'Abigail Larasati', jenis_kelamin: 'Perempuan', tanggal_lahir: '2001-09-30', tahun_lahir: 2001, bulan_lahir: 9, kuliah_kerja: 'Kuliah', no_handphone: '081234567022', ketertarikan_cgf: 'Belum Mau Join', nama_cgf: null, kategori_domisili: 'Bekasi', alamat_domisili: 'Jl. Harapan Indah No. 25' },
  { no_jemaat: 1023, nama_jemaat: 'Natan Ridwan', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1960-02-14', tahun_lahir: 1960, bulan_lahir: 2, kuliah_kerja: 'Kerja', no_handphone: '081234567023', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sukacita', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Blok M Square No. 3' },
  { no_jemaat: 1024, nama_jemaat: 'Lidia Purnamasari', jenis_kelamin: 'Perempuan', tanggal_lahir: '1958-07-08', tahun_lahir: 1958, bulan_lahir: 7, kuliah_kerja: 'Kerja', no_handphone: '081234567024', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sabar', kategori_domisili: 'Jakarta Utara', alamat_domisili: 'Jl. Pantai Indah Kapuk No. 9' },
  { no_jemaat: 1025, nama_jemaat: 'Imanuel Sihombing', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1965-11-21', tahun_lahir: 1965, bulan_lahir: 11, kuliah_kerja: 'Kerja', no_handphone: '081234567025', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kesetiaan', kategori_domisili: 'Bekasi', alamat_domisili: 'Jl. Galaxy No. 18' },
  { no_jemaat: 1026, nama_jemaat: 'Kirenius Sagala', jenis_kelamin: 'Laki-laki', tanggal_lahir: '2002-04-03', tahun_lahir: 2002, bulan_lahir: 4, kuliah_kerja: 'Kuliah', no_handphone: '081234567026', ketertarikan_cgf: 'Belum Mau Join', nama_cgf: null, kategori_domisili: 'Tangerang', alamat_domisili: 'Jl. Ciputat No. 60' },
  { no_jemaat: 1027, nama_jemaat: 'Naomi Simanjuntak', jenis_kelamin: 'Perempuan', tanggal_lahir: '1986-01-29', tahun_lahir: 1986, bulan_lahir: 1, kuliah_kerja: 'Kerja', no_handphone: '081234567027', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kerendahan Hati', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Senayan No. 2' },
  { no_jemaat: 1028, nama_jemaat: 'Obed Manurung', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1970-06-16', tahun_lahir: 1970, bulan_lahir: 6, kuliah_kerja: 'Kerja', no_handphone: '081234567028', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Kemurahan', kategori_domisili: 'Depok', alamat_domisili: 'Jl. Sawangan No. 70' },
  { no_jemaat: 1029, nama_jemaat: 'Priscilla Anggraeni', jenis_kelamin: 'Perempuan', tanggal_lahir: '1996-10-10', tahun_lahir: 1996, bulan_lahir: 10, kuliah_kerja: 'Kerja', no_handphone: '081234567029', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Pengendalian Diri', kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Tomang No. 35' },
  { no_jemaat: 1030, nama_jemaat: 'Rafael Hutapea', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1994-02-28', tahun_lahir: 1994, bulan_lahir: 2, kuliah_kerja: 'Kerja', no_handphone: '081234567030', ketertarikan_cgf: 'Belum Mau Join', nama_cgf: null, kategori_domisili: 'Jakarta Utara', alamat_domisili: 'Jl. Ancol Timur No. 14' },
  { no_jemaat: 1032, nama_jemaat: 'Titus Sibarani', jenis_kelamin: 'Laki-laki', tanggal_lahir: '2004-12-12', tahun_lahir: 2004, bulan_lahir: 12, kuliah_kerja: 'Kuliah', no_handphone: '081234567032', ketertarikan_cgf: 'Mau Join', nama_cgf: null, kategori_domisili: 'Bekasi', alamat_domisili: 'Jl. Bintara No. 42' },
  { no_jemaat: 1033, nama_jemaat: 'Ulfa Ramadhani', jenis_kelamin: 'Perempuan', tanggal_lahir: '1999-09-19', tahun_lahir: 1999, bulan_lahir: 9, kuliah_kerja: 'Kuliah', no_handphone: '081234567033', ketertarikan_cgf: 'Belum Mau Join', nama_cgf: null, kategori_domisili: 'Jakarta Barat', alamat_domisili: 'Jl. Srengseng No. 20' },
  { no_jemaat: 1034, nama_jemaat: 'Viktor Nainggolan', jenis_kelamin: 'Laki-laki', tanggal_lahir: '1955-03-23', tahun_lahir: 1955, bulan_lahir: 3, kuliah_kerja: 'Kerja', no_handphone: '081234567034', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Damai', kategori_domisili: 'Jakarta Selatan', alamat_domisili: 'Jl. Radio Dalam No. 7' },
  { no_jemaat: 1035, nama_jemaat: 'Wisye Pakpahan', jenis_kelamin: 'Perempuan', tanggal_lahir: '1962-08-15', tahun_lahir: 1962, bulan_lahir: 8, kuliah_kerja: 'Kerja', no_handphone: '081234567035', ketertarikan_cgf: 'Sudah Join', nama_cgf: 'CGF Sukacita', kategori_domisili: 'Tangerang', alamat_domisili: 'Jl. Serpong Utara No. 55' },
];

// ============================================================
// MOCK DATA - PELAYANAN INFO (Service/Ministry Types)
// ============================================================

const pelayananInfo = [
  { pelayanan_id: 'P001', nama_pelayanan: 'Worship Leader' },
  { pelayanan_id: 'P002', nama_pelayanan: 'Singer' },
  { pelayanan_id: 'P003', nama_pelayanan: 'Pianist' },
  { pelayanan_id: 'P004', nama_pelayanan: 'Saxophone' },
  { pelayanan_id: 'P005', nama_pelayanan: 'Filler Musician' },
  { pelayanan_id: 'P006', nama_pelayanan: 'Bass Guitarist' },
  { pelayanan_id: 'P007', nama_pelayanan: 'Drummer' },
  { pelayanan_id: 'P008', nama_pelayanan: 'Multimedia' },
  { pelayanan_id: 'P009', nama_pelayanan: 'Sound Engineer' },
  { pelayanan_id: 'P010', nama_pelayanan: 'Caring Team' },
  { pelayanan_id: 'P011', nama_pelayanan: 'Connexion Crew' },
  { pelayanan_id: 'P012', nama_pelayanan: 'Supporting Crew' },
  { pelayanan_id: 'P013', nama_pelayanan: 'CForce' },
  { pelayanan_id: 'P014', nama_pelayanan: 'CG Leader' },
  { pelayanan_id: 'P015', nama_pelayanan: 'Community PIC' },
  { pelayanan_id: 'P016', nama_pelayanan: 'Others' },
];

// ============================================================
// MOCK DATA - PELAYAN (Service/Ministry Members)
// ============================================================

const pelayan = [
  { no_jemaat: 1001, nama_jemaat: 'Andreas Wijaya', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: true, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: true, is_community_pic: false, total_pelayanan: 45 },
  { no_jemaat: 1002, nama_jemaat: 'Maria Sari', is_wl: false, is_singer: true, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 18 },
  { no_jemaat: 1003, nama_jemaat: 'Daniel Setiawan', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: true, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: true, is_community_pic: false, total_pelayanan: 52 },
  { no_jemaat: 1004, nama_jemaat: 'Sarah Hartono', is_wl: false, is_singer: false, is_pianis: true, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 22 },
  { no_jemaat: 1005, nama_jemaat: 'Yohanes Pratama', is_wl: true, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: true, is_cforce: false, is_cg_leader: true, is_community_pic: false, total_pelayanan: 38 },
  { no_jemaat: 1006, nama_jemaat: 'Esther Lim', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: true, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 15 },
  { no_jemaat: 1007, nama_jemaat: 'Yakobus Santoso', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: true, is_cg_leader: true, is_community_pic: false, total_pelayanan: 41 },
  { no_jemaat: 1008, nama_jemaat: 'Ruth Natalia', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: true, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 12 },
  { no_jemaat: 1009, nama_jemaat: 'Daud Kurniawan', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: true, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: true, is_community_pic: false, total_pelayanan: 48 },
  { no_jemaat: 1010, nama_jemaat: 'Deborah Susanti', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: true, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 20 },
  { no_jemaat: 1011, nama_jemaat: 'Paulus Gunawan', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: true, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: true, is_community_pic: false, total_pelayanan: 55 },
  { no_jemaat: 1012, nama_jemaat: 'Hana Wijayanti', is_wl: false, is_singer: true, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: true, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 24 },
  { no_jemaat: 1013, nama_jemaat: 'Samuel Tan', is_wl: false, is_singer: false, is_pianis: true, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: true, is_community_pic: false, total_pelayanan: 36 },
  { no_jemaat: 1014, nama_jemaat: 'Grace Oktavia', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: true, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 10 },
  { no_jemaat: 1015, nama_jemaat: 'Timothy Halim', is_wl: true, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: true, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: true, is_community_pic: false, total_pelayanan: 60 },
  { no_jemaat: 1016, nama_jemaat: 'Mikhaela Tampubolon', is_wl: false, is_singer: false, is_pianis: true, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 14 },
  { no_jemaat: 1017, nama_jemaat: 'Gabriel Saputra', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: true, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: true, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 28 },
  { no_jemaat: 1018, nama_jemaat: 'Brenda Anggraini', is_wl: false, is_singer: true, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: true, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 30 },
  { no_jemaat: 1023, nama_jemaat: 'Natan Ridwan', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: true, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 8 },
  { no_jemaat: 1025, nama_jemaat: 'Imanuel Sihombing', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: true, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 16 },
  { no_jemaat: 1027, nama_jemaat: 'Naomi Simanjuntak', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: true, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: true, total_pelayanan: 35 },
  { no_jemaat: 1029, nama_jemaat: 'Priscilla Anggraeni', is_wl: false, is_singer: false, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: true, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 11 },
  { no_jemaat: 1031, nama_jemaat: 'Sela Marpaung', is_wl: false, is_singer: true, is_pianis: false, is_saxophone: false, is_filler: false, is_bass_gitar: false, is_drum: false, is_mulmed: false, is_sound: false, is_caringteam: false, is_connexion_crew: false, is_supporting_crew: false, is_cforce: false, is_cg_leader: false, is_community_pic: false, total_pelayanan: 19 },
];

// ============================================================
// MOCK DATA - STATUS HISTORY (cnx_jemaat_status_history)
// ============================================================

const cnx_jemaat_status_history = [
  // Andreas Wijaya - Active throughout
  { id: 1, no_jemaat: 1001, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Maria Sari - Active throughout
  { id: 2, no_jemaat: 1002, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Daniel Setiawan - Active throughout
  { id: 3, no_jemaat: 1003, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Sarah Hartono - Active, went Inactive briefly, back to Active
  { id: 4, no_jemaat: 1004, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  { id: 5, no_jemaat: 1004, status: 'Inactive', changed_at: '2025-06-15T10:00:00Z', reason: 'Pindah kota sementara untuk tugas kantor' },
  { id: 6, no_jemaat: 1004, status: 'Active', changed_at: '2025-11-01T08:00:00Z', reason: 'Kembali dari penugasan luar kota' },
  // Yohanes Pratama - Active throughout
  { id: 7, no_jemaat: 1005, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Esther Lim - No Information
  { id: 8, no_jemaat: 1006, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  { id: 9, no_jemaat: 1006, status: 'No Information', changed_at: '2025-12-01T08:00:00Z', reason: 'Istirahat untuk pemulihan kesehatan' },
  // Yakobus Santoso - Active throughout
  { id: 10, no_jemaat: 1007, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Ruth Natalia - Active throughout
  { id: 11, no_jemaat: 1008, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Daud Kurniawan - Active throughout
  { id: 12, no_jemaat: 1009, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Deborah Susanti - Active throughout
  { id: 13, no_jemaat: 1010, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Paulus Gunawan - Active throughout
  { id: 14, no_jemaat: 1011, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Hana Wijayanti - Active throughout
  { id: 15, no_jemaat: 1012, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Samuel Tan - Active throughout
  { id: 16, no_jemaat: 1013, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Grace Oktavia - Active throughout
  { id: 17, no_jemaat: 1014, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Timothy Halim - Active throughout
  { id: 18, no_jemaat: 1015, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Mikhaela Tampubolon - Active, then Moved
  { id: 19, no_jemaat: 1016, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  { id: 20, no_jemaat: 1016, status: 'Moved', changed_at: '2025-09-01T08:00:00Z', reason: 'Pindah domisili ke Surabaya untuk pekerjaan' },
  // Gabriel Saputra - Active throughout
  { id: 21, no_jemaat: 1017, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Brenda Anggraini - Active, Inactive briefly, Active again
  { id: 22, no_jemaat: 1018, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  { id: 23, no_jemaat: 1018, status: 'Inactive', changed_at: '2025-07-10T10:00:00Z', reason: 'Fokus skripsi semester akhir' },
  { id: 24, no_jemaat: 1018, status: 'Active', changed_at: '2025-12-20T08:00:00Z', reason: 'Lulus dan kembali aktif' },
  // Michael Putra - Inactive recently
  { id: 25, no_jemaat: 1019, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  { id: 26, no_jemaat: 1019, status: 'Inactive', changed_at: '2026-03-15T10:00:00Z', reason: 'Kesibukan pekerjaan yang sangat padat' },
  // Catherine Widodo - Active throughout
  { id: 27, no_jemaat: 1020, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Ezra Nugroho - Active, then Moved
  { id: 28, no_jemaat: 1021, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  { id: 29, no_jemaat: 1021, status: 'Moved', changed_at: '2025-08-15T08:00:00Z', reason: 'Melanjutkan studi di Bandung' },
  // Abigail Larasati - Active throughout
  { id: 30, no_jemaat: 1022, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Natan Ridwan - Active throughout
  { id: 31, no_jemaat: 1023, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Lidia Purnamasari - Active, then No Information
  { id: 32, no_jemaat: 1024, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  { id: 33, no_jemaat: 1024, status: 'No Information', changed_at: '2025-11-15T08:00:00Z', reason: 'Istirahat karena kondisi kesehatan' },
  // Imanuel Sihombing - Active throughout
  { id: 34, no_jemaat: 1025, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Kirenius Sagala - Active throughout
  { id: 35, no_jemaat: 1026, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Naomi Simanjuntak - Active throughout
  { id: 36, no_jemaat: 1027, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Obed Manurung - Active, Inactive recently
  { id: 37, no_jemaat: 1028, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  { id: 38, no_jemaat: 1028, status: 'Inactive', changed_at: '2026-03-20T10:00:00Z', reason: 'Konflik jadwal dengan komitmen keluarga' },
  // Priscilla Anggraeni - Active throughout
  { id: 39, no_jemaat: 1029, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Rafael Hutapea - Active throughout
  { id: 40, no_jemaat: 1030, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Sela Marpaung - Active throughout
  { id: 41, no_jemaat: 1031, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Titus Sibarani - Active throughout
  { id: 42, no_jemaat: 1032, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Ulfa Ramadhani - Active throughout
  { id: 43, no_jemaat: 1033, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Viktor Nainggolan - Active throughout
  { id: 44, no_jemaat: 1034, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  // Wisye Pakpahan - Active, Inactive recently
  { id: 45, no_jemaat: 1035, status: 'Active', changed_at: '2024-10-01T08:00:00Z', reason: null },
  { id: 46, no_jemaat: 1035, status: 'Inactive', changed_at: '2026-03-25T10:00:00Z', reason: 'Pindah rumah dan belum menemukan CGF baru' },
];

// ============================================================
// MOCK DATA - EVENT HISTORY
// Past 12 months: April 2025 - April 2026
// ============================================================

const event_history = [
  { event_id: 1, event_name: 'Easter Retreat 2025', event_date: '2025-04-18', category: 'Retreat', location: 'Villa Istana Bunga, Lembang', description: 'Retreat Paskah dengan tema "Kebangkitan dan Harapan Baru" selama 3 hari 2 malam', gcal_event_id: 'gcal_abc123', gcal_link: 'https://calendar.google.com/event?eid=abc123', last_synced_at: '2025-04-10T08:00:00Z' },
  { event_id: 2, event_name: 'Worship Night Mei', event_date: '2025-05-17', category: 'Monthly', location: 'Gedung Gereja Utama', description: 'Malam pujian dan penyembahan bulanan dengan tema "Berserah"', gcal_event_id: 'gcal_def456', gcal_link: 'https://calendar.google.com/event?eid=def456', last_synced_at: '2025-05-10T09:00:00Z' },
  { event_id: 3, event_name: 'Quarterly Fellowship Q2', event_date: '2025-06-14', category: 'Quarterly', location: 'Aula Serbaguna Komunitas', description: 'Fellowship triwulanan dengan games, makan bersama, dan sharing kesaksian', gcal_event_id: null, gcal_link: null, last_synced_at: null },
  { event_id: 4, event_name: 'Youth Camp 2025', event_date: '2025-07-04', category: 'Camp', location: 'Bumi Perkemahan Cibubur', description: 'Kemah pemuda selama 4 hari dengan pelatihan kepemimpinan dan ibadah outdoor', gcal_event_id: 'gcal_ghi789', gcal_link: 'https://calendar.google.com/event?eid=ghi789', last_synced_at: '2025-06-28T10:00:00Z' },
  { event_id: 5, event_name: 'Worship Night Agustus', event_date: '2025-08-16', category: 'Monthly', location: 'Gedung Gereja Utama', description: 'Malam pujian dengan tema "Kemerdekaan Sejati"', gcal_event_id: null, gcal_link: null, last_synced_at: null },
  { event_id: 6, event_name: 'Quarterly Fellowship Q3', event_date: '2025-09-13', category: 'Quarterly', location: 'Aula Serbaguna Komunitas', description: 'Fellowship triwulanan dengan acara bakar-bakar dan sharing pelayanan', gcal_event_id: 'gcal_jkl012', gcal_link: 'https://calendar.google.com/event?eid=jkl012', last_synced_at: '2025-09-05T11:00:00Z' },
  { event_id: 7, event_name: 'Family Retreat 2025', event_date: '2025-10-03', category: 'Retreat', location: 'Hotel Puncak Pass Resort', description: 'Retreat keluarga dengan sesi parenting dan family bonding', gcal_event_id: 'gcal_mno345', gcal_link: 'https://calendar.google.com/event?eid=mno345', last_synced_at: '2025-09-25T08:00:00Z' },
  { event_id: 8, event_name: 'Worship Night November', event_date: '2025-11-15', category: 'Monthly', location: 'Gedung Gereja Utama', description: 'Malam pujian dengan tema "Syukur dan Pengharapan"', gcal_event_id: null, gcal_link: null, last_synced_at: null },
  { event_id: 9, event_name: 'Christmas Service 2025', event_date: '2025-12-24', category: 'Special', location: 'Gedung Gereja Utama', description: 'Ibadah Natal dengan drama, paduan suara, dan perayaan kelahiran Kristus', gcal_event_id: 'gcal_pqr678', gcal_link: 'https://calendar.google.com/event?eid=pqr678', last_synced_at: '2025-12-15T09:00:00Z' },
  { event_id: 10, event_name: 'New Year Revival 2026', event_date: '2026-01-01', category: 'Special', location: 'Gedung Gereja Utama', description: 'Ibadah pergantian tahun dengan doa syafaat dan komitmen baru', gcal_event_id: 'gcal_stu901', gcal_link: 'https://calendar.google.com/event?eid=stu901', last_synced_at: '2025-12-28T10:00:00Z' },
  { event_id: 11, event_name: 'Quarterly Fellowship Q1 2026', event_date: '2026-01-17', category: 'Quarterly', location: 'Aula Serbaguna Komunitas', description: 'Fellowship triwulanan awal tahun dengan visi dan tujuan 2026', gcal_event_id: null, gcal_link: null, last_synced_at: null },
  { event_id: 12, event_name: 'Worship Night Februari', event_date: '2026-02-14', category: 'Monthly', location: 'Gedung Gereja Utama', description: 'Malam pujian kasih dengan tema "Kasih yang Memulihkan"', gcal_event_id: 'gcal_vwx234', gcal_link: 'https://calendar.google.com/event?eid=vwx234', last_synced_at: '2026-02-08T08:00:00Z' },
  { event_id: 13, event_name: 'Easter Retreat 2026', event_date: '2026-04-03', category: 'Retreat', location: 'Villa Istana Bunga, Lembang', description: 'Retreat Paskah dengan tema "Hidup Baru dalam Kristus"', gcal_event_id: 'gcal_yza567', gcal_link: 'https://calendar.google.com/event?eid=yza567', last_synced_at: '2026-03-28T09:00:00Z' },
  { event_id: 14, event_name: 'Worship Night Maret', event_date: '2026-03-14', category: 'Monthly', location: 'Gedung Gereja Utama', description: 'Malam pujian dengan tema "Iman yang Teguh"', gcal_event_id: 'gcal_bcd890', gcal_link: 'https://calendar.google.com/event?eid=bcd890', last_synced_at: '2026-03-08T10:00:00Z' },
  { event_id: 15, event_name: 'Quarterly Fellowship Q2 2026', event_date: '2026-04-18', category: 'Quarterly', location: 'Aula Serbaguna Komunitas', description: 'Fellowship triwulanan Q2 dengan tema "Pertumbuhan Bersama"', gcal_event_id: null, gcal_link: null, last_synced_at: null },
  { event_id: 16, event_name: 'Prayer Breakfast', event_date: '2026-04-04', category: 'Monthly', location: 'Gedung Gereja Utama', description: 'Sarapan doa bersama untuk memulai bulan April dengan syukur', gcal_event_id: 'gcal_efg111', gcal_link: 'https://calendar.google.com/event?eid=efg111', last_synced_at: '2026-03-30T08:00:00Z' },
  { event_id: 17, event_name: 'Community Service Day', event_date: '2026-04-05', category: 'Special', location: 'RPTRA Kalijodo', description: 'Pelayanan komunitas membersihkan taman dan berbagi kasih dengan warga sekitar', gcal_event_id: null, gcal_link: null, last_synced_at: null },
  { event_id: 18, event_name: 'Youth Gathering', event_date: '2026-04-06', category: 'Monthly', location: 'Cafe Grace, Kemang', description: 'Pertemuan pemuda dengan diskusi dan fellowship santai', gcal_event_id: 'gcal_hij222', gcal_link: 'https://calendar.google.com/event?eid=hij222', last_synced_at: '2026-04-01T07:00:00Z' },
  { event_id: 19, event_name: 'CGF Leaders Meeting', event_date: '2026-04-08', category: 'Quarterly', location: 'Ruang Rapat Gereja Lt. 2', description: 'Rapat koordinasi pemimpin CGF untuk program Q2 2026', gcal_event_id: null, gcal_link: null, last_synced_at: null },
];

// ============================================================
// MOCK DATA - EVENT PARTICIPATION
// ============================================================

function generateEventParticipation() {
  const records = [];
  let id = 1;
  const memberIds = members.map(m => m.no_jemaat);
  const roles = ['Peserta', 'Panitia', 'Volunteer'];

  event_history.forEach(event => {
    const participantCount = 15 + Math.floor(Math.random() * 16);
    const shuffled = [...memberIds].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, participantCount);

    selected.forEach(no_jemaat => {
      const rand = Math.random();
      let role;
      if (rand < 0.6) role = 'Peserta';
      else if (rand < 0.8) role = 'Panitia';
      else role = 'Volunteer';

      const eventDate = new Date(event.event_date);
      const regDate = new Date(eventDate);
      regDate.setDate(regDate.getDate() - Math.floor(Math.random() * 30) - 1);

      records.push({
        id: id++,
        event_id: event.event_id,
        no_jemaat,
        role,
        registered_at: regDate.toISOString(),
      });
    });
  });

  return records;
}

const event_participation = generateEventParticipation();

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

async function getMembers() {
  if (membersCache) return membersCache;
  membersCache = fetch(`${API_BASE}/members?limit=1000`)
    .then(res => res.json())
    .then(json => json.data || []);
  return membersCache;
}

async function getMemberById(no_jemaat) {
  const res = await fetch(`${API_BASE}/members/${no_jemaat}`);
  const json = await res.json();
  return json.data ?? null;
}

async function getEvents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', filters.page);
  if (filters.limit) params.set('limit', filters.limit);
  if (filters.category) params.set('category', filters.category);
  if (filters.start_date) params.set('start_date', filters.start_date);
  if (filters.end_date) params.set('end_date', filters.end_date);
  const query = params.toString();
  const res = await fetch(`${API_BASE}/events${query ? `?${query}` : ''}`);
  const json = await res.json();
  return json.data || [];
}

async function getEventById(eventId) {
  const res = await fetch(`${API_BASE}/events/${eventId}`);
  const json = await res.json();
  return json.data ?? null;
}

// async function getUpcomingEvents(days = 7) {
//   const now = new Date();
//   const endDate = new Date(now);
//   endDate.setDate(endDate.getDate() + days);
//   const nowStr = now.toISOString().split('T')[0];
//   const endStr = endDate.toISOString().split('T')[0];
//   const events = await getEvents({ start_date: nowStr, end_date: endStr, limit: 100 });
//   return events;
// }

function getCGFGroups() {
  return [...cgfGroups];
}

function getCGFGroupById(cg_id) {
  return cgfGroups.find(g => g.cg_id === cg_id) || null;
}

async function getCGFMembers(cg_id) {
  const assignments = cgfMembers.filter(cm => cm.cg_id === cg_id);
  const membersData = await getMembers();
  return assignments.map(assignment => {
    const member = membersData.find(m => m.no_jemaat === assignment.no_jemaat);
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

function getPelayananInfo() {
  return [...pelayananInfo];
}

function getPelayananInfoById(pelayanan_id) {
  return pelayananInfo.find(p => p.pelayanan_id === pelayanan_id) || null;
}

// Cache for API calls to prevent redundant requests
let pelayanCache = null;
let statusHistoryCache = null;
let membersCache = null;

export async function getPelayan() {
  if (pelayanCache) return pelayanCache;
  pelayanCache = fetch(`${API_BASE}/ministry/pelayan?limit=1000`)
    .then(res => res.json())
    .then(json => json.data || []);
  return pelayanCache;
}

export async function getPelayanById(no_jemaat) {
  const res = await fetch(`${API_BASE}/ministry/pelayan/${no_jemaat}`);
  const json = await res.json();
  return json.data ?? null;
}

export async function getStatusHistory() {
  if (statusHistoryCache) return statusHistoryCache;
  statusHistoryCache = fetch(`${API_BASE}/status/status-history?limit=1000`)
    .then(res => res.json())
    .then(json => json.data || []);
  return statusHistoryCache;
}

export async function getDashboardKPIs() {
  const res = await fetch(`${API_BASE}/analytics/dashboard`)
  return (await res.json()).data ?? {};
}

export async function getGenderDistribution() {
  const res = await fetch(`${API_BASE}/analytics/members/distribution`)
  return (await res.json()).data ?? [];
}

async function getAgeDistribution() {
  const currentYear = 2026;
  const distribution = { '10s': 0, '20s': 0, '30s': 0, '40s': 0, '50s': 0, '60s+': 0 };

  const members = await getMembers();
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

async function getDomisiliDistribution() {
  const distribution = {};
  const members = await getMembers();
  DOMISILI_AREAS.forEach(area => {
    distribution[area] = members.filter(m => m.kategori_domisili === area).length;
  });
  return distribution;
}

// function getCGFSizes() {
//   return cgfGroups.map(group => {
//     const size = cgfMembers.filter(cm => cm.cg_id === group.cg_id).length;
//     return {
//       cg_id: group.cg_id,
//       nama_cgf: group.nama_cgf,
//       member_count: size,
//     };
//   });
// }

export async function getCGFSizes() {
  const res = await fetch(`${API_BASE}/analytics/cgf/sizes`)
  return (await res.json()).data ?? [];
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

async function getCGFInterestFunnel() {
  const members = await getMembers();
  const belumMauJoin = members.filter(m => m.ketertarikan_cgf === 'Belum Mau Join').length;
  const mauJoin = members.filter(m => m.ketertarikan_cgf === 'Mau Join').length;
  const sudahJoin = members.filter(m => m.ketertarikan_cgf === 'Sudah Join').length;
  const sudahTidakJoin = members.filter(m => m.ketertarikan_cgf === 'Sudah Tidak Join').length;
  return { belumMauJoin, mauJoin, sudahJoin, sudahTidakJoin };
}

async function getKuliahKerjaRatio() {
  const members = await getMembers();
  const kuliah = members.filter(m => m.kuliah_kerja === 'Kuliah').length;
  const kerja = members.filter(m => m.kuliah_kerja === 'Kerja').length;
  return { kuliah, kerja };
}

async function getBirthdayMembers() {
  const currentMonth = 4; // April
  const members = await getMembers();
  return members.filter(m => m.bulan_lahir === currentMonth);
}

export async function getStatusDistribution() {
  const res = await fetch(`${API_BASE}/analytics/members/status/distribution`)
  const result = await res.json()

  // Convert array [{ status_aktif: 'Active', count: 10 }, ...] to object { Active: 10, ... }
  const distribution = { Active: 0, Inactive: 0, 'No Information': 0, Moved: 0 };
  (result.data || []).forEach(item => {
    if (distribution[item.status_aktif] !== undefined) {
      distribution[item.status_aktif] = item.count;
    }
  });
  return distribution;
}

export async function getStatusTrend() {
  const statusHistory = await getStatusHistory();
  const now = new Date('2026-04-03');
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const monthLabel = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });

    const latestStatuses = {};
    statusHistory.forEach(record => {
      if (new Date(record.changed_at) <= monthEnd) {
        if (!latestStatuses[record.no_jemaat] || new Date(record.changed_at) > new Date(latestStatuses[record.no_jemaat].changed_at)) {
          latestStatuses[record.no_jemaat] = record;
        }
      }
    });

    const counts = { Active: 0, Inactive: 0, 'No Information': 0, Moved: 0 };
    Object.values(latestStatuses).forEach(record => {
      if (counts[record.status] !== undefined) {
        counts[record.status]++;
      }
    });

    months.push({ month: monthLabel, ...counts });
  }

  return months;
}

export async function getMinistryParticipation() {
  const pelayanData = await getPelayan();
  const totalServing = pelayanData.length;
  const ministryFields = [
    { key: 'is_wl', name: 'Worship Leader' },
    { key: 'is_singer', name: 'Singer' },
    { key: 'is_pianis', name: 'Pianist' },
    { key: 'is_saxophone', name: 'Saxophone' },
    { key: 'is_filler', name: 'Filler Musician' },
    { key: 'is_bass_gitar', name: 'Bass Guitarist' },
    { key: 'is_drum', name: 'Drummer' },
    { key: 'is_mulmed', name: 'Multimedia' },
    { key: 'is_sound', name: 'Sound Engineer' },
    { key: 'is_caringteam', name: 'Care Team' },
    { key: 'is_connexion_crew', name: 'Connexion Crew' },
    { key: 'is_supporting_crew', name: 'Supporting Crew' },
    { key: 'is_cforce', name: 'CForce' },
    { key: 'is_cg_leader', name: 'CG Leader' },
    { key: 'is_community_pic', name: 'Community PIC' },
  ];

  return ministryFields.map(m => {
    const count = pelayanData.filter(p => p[m.key]).length;
    return {
      ministry: m.name,
      count,
      percentage: Math.round((count / totalServing) * 100),
    };
  }).sort((a, b) => b.count - a.count);
}

export async function getTotalServingMembers() {
  const pelayanData = await getPelayan();
  return Array.isArray(pelayanData) ? pelayanData.length : 0;
}

export async function getServingPercentage() {
  const [pelayanData, statusHistory, dist] = await Promise.all([
    getPelayan(),
    getStatusHistory(),
    getStatusDistribution()
  ]);
  if (!Array.isArray(pelayanData) || !Array.isArray(statusHistory)) {
    return 0;
  }
  const activeMembers = dist.Active || 0;
  const serving = pelayanData.filter(p => {
    const memberStatus = statusHistory
      .filter(r => r.no_jemaat === p.no_jemaat)
      .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))[0];
    return memberStatus && memberStatus.status === 'Active';
  }).length;
  return activeMembers > 0 ? Math.round((serving / activeMembers) * 100) : 0;
}

export async function getRecentStatusChanges(limit = 10) {
  const statusHistory = await getStatusHistory();
  const members = await getMembers();
  const withNames = statusHistory.map(record => {
    const member = members.find(m => m.no_jemaat === record.no_jemaat);
    return {
      ...record,
      nama_jemaat: member ? member.nama_jemaat : 'Unknown',
    };
  });
  return withNames
    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))
    .slice(0, limit);
}

export async function getStatusHistoryForMember(no_jemaat) {
  const statusHistory = await getStatusHistory();
  return statusHistory
    .filter(r => r.no_jemaat === no_jemaat)
    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
}

export async function getAtRiskMembers() {
  const statusHistory = await getStatusHistory();
  const members = await getMembers();
  const now = new Date('2026-04-03');
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const atRisk = [];

  members.forEach(member => {
    const memberHistory = statusHistory
      .filter(r => r.no_jemaat === member.no_jemaat)
      .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));

    if (memberHistory.length === 0) return;

    const latestStatus = memberHistory[0];
    let riskLevel = null;
    let riskReason = '';
    let riskScore = 0;

    // Inactive within 30 days
    if (latestStatus.status === 'Inactive' && new Date(latestStatus.changed_at) >= thirtyDaysAgo) {
      riskLevel = 'high';
      riskReason = 'Baru menjadi tidak aktif dalam 30 hari terakhir';
      riskScore = 5;
    }

    // 2+ status changes in 6 months
    const recentChanges = memberHistory.filter(r => new Date(r.changed_at) >= sixMonthsAgo);
    if (recentChanges.length >= 2) {
      if (!riskLevel) {
        riskLevel = 'medium';
        riskReason = `${recentChanges.length} perubahan status dalam 6 bulan terakhir`;
        riskScore = 3;
      } else {
        riskReason += '; ' + `${recentChanges.length} perubahan status dalam 6 bulan`;
        riskScore = Math.max(riskScore, 4);
      }
    }

    // No Information for 3+ months
    if (latestStatus.status === 'No Information' && new Date(latestStatus.changed_at) <= threeMonthsAgo) {
      if (!riskLevel) {
        riskLevel = 'medium';
        riskReason = 'No Information selama lebih dari 3 bulan';
        riskScore = 3;
      } else {
        riskReason += '; No Information selama lebih dari 3 bulan';
        riskScore = Math.max(riskScore, 4);
      }
    }

    if (riskLevel) {
      atRisk.push({
        no_jemaat: member.no_jemaat,
        nama_jemaat: member.nama_jemaat,
        riskLevel,
        riskReason,
        status: latestStatus.status,
        riskScore,
      });
    }
  });

  return atRisk.sort((a, b) => b.riskScore - a.riskScore);
}

export async function getServiceFrequencyDistribution() {
  const pelayanData = await getPelayan();
  const buckets = { '1': 0, '2': 0, '3': 0, '4+': 0 };
  const sums = { '1': 0, '2': 0, '3': 0, '4+': 0 };

  pelayanData.forEach(p => {
    const t = p.total_pelayanan;
    let key;
    if (t === 1) key = '1';
    else if (t === 2) key = '2';
    else if (t === 3) key = '3';
    else key = '4+';
    buckets[key]++;
    sums[key] += t;
  });

  return Object.entries(buckets).map(([range, count]) => ({
    range,
    count,
    avgServices: count > 0 ? Math.round(sums[range] / count) : 0,
  }));
}

export async function getUpcomingEvents(days = 7) {
  const now = new Date('2026-04-03');
  const endDate = new Date(now);
  endDate.setDate(endDate.getDate() + days);
  const nowStr = now.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  const upcoming = event_history
    .filter(e => e.event_date >= nowStr && e.event_date <= endStr)
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  return upcoming.map(event => {
    const participantCount = event_participation.filter(ep => ep.event_id === event.event_id).length;
    return { ...event, participantCount };
  });
}

export async function getWorshipTeamComposition() {
  const pelayanData = await getPelayan();
  const vocalists = {
    total: pelayanData.filter(p => p.is_singer || p.is_wl).length,
    singers: pelayanData.filter(p => p.is_singer).length,
    worshipLeaders: pelayanData.filter(p => p.is_wl).length,
  };
  const instrumentalists = {
    total: pelayanData.filter(p => p.is_pianis || p.is_saxophone || p.is_bass_gitar || p.is_drum || p.is_filler).length,
    pianist: pelayanData.filter(p => p.is_pianis).length,
    saxophone: pelayanData.filter(p => p.is_saxophone).length,
    bass: pelayanData.filter(p => p.is_bass_gitar).length,
    drums: pelayanData.filter(p => p.is_drum).length,
    filler: pelayanData.filter(p => p.is_filler).length,
  };
  return { vocalists, instrumentalists };
}

export async function getEventAttendanceTrend() {
  const now = new Date('2026-04-03');
  const months = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const monthLabel = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });

    const monthEvents = event_history.filter(e => {
      const eventDate = new Date(e.event_date);
      return eventDate >= d && eventDate <= monthEnd;
    });

    const categories = { Camp: 0, Retreat: 0, Quarterly: 0, Monthly: 0, Special: 0 };
    monthEvents.forEach(event => {
      const count = event_participation.filter(ep => ep.event_id === event.event_id).length;
      categories[event.category] += count;
    });

    months.push({ month: monthLabel, ...categories });
  }

  return months;
}

export async function getMultiSkillDistribution() {
  const pelayanData = await getPelayan();
  const distribution = {};
  pelayanData.forEach(p => {
    const count = [p.is_wl, p.is_singer, p.is_pianis, p.is_saxophone, p.is_filler, p.is_bass_gitar, p.is_drum, p.is_mulmed, p.is_sound, p.is_caringteam, p.is_connexion_crew, p.is_supporting_crew, p.is_cforce, p.is_cg_leader, p.is_community_pic].filter(Boolean).length;
    const key = count.toString();
    distribution[key] = (distribution[key] || 0) + 1;
  });

  return Object.entries(distribution)
    .map(([skills, count]) => ({ skills: parseInt(skills), count }))
    .sort((a, b) => a.skills - b.skills);
}

export async function getCGHealthData() {
  const statusHistory = await getStatusHistory();
  return cgfGroups.map(group => {
    const groupMemberIds = cgfMembers.filter(cm => cm.cg_id === group.cg_id).map(cm => cm.no_jemaat);
    const memberCount = groupMemberIds.length;
    const capacity = 12;

    const groupAttendance = cgfAttendance.filter(r => r.cg_id === group.cg_id);
    const hadirCount = groupAttendance.filter(r => r.keterangan === 'hadir').length;
    const attendanceRate = groupAttendance.length > 0 ? Math.round((hadirCount / groupAttendance.length) * 100) : 0;

    const quarterStart = new Date('2026-01-01');
    const newMembersThisQuarter = cgfMembers.filter(cm => {
      return cm.cg_id === group.cg_id && cm.id > 20;
    }).length;

    const atRiskMembers = groupMemberIds.filter(no_jemaat => {
      const latestStatus = statusHistory
        .filter(r => r.no_jemaat === no_jemaat)
        .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at))[0];
      return latestStatus && (latestStatus.status === 'Inactive' || latestStatus.status === 'No Information');
    }).length;

    return {
      cg_id: group.cg_id,
      nama_cgf: group.nama_cgf,
      leader_name: group.leader_name,
      memberCount,
      capacity,
      attendanceRate,
      newMembersThisQuarter,
      atRiskMembers,
    };
  });
}

export async function getMemberEngagementScore(no_jemaat) {
  const [pelayanData, statusHistory] = await Promise.all([
    getPelayan(),
    getStatusHistory()
  ]);
  let serviceScore = 0;
  const memberPelayan = pelayanData.find(p => p.no_jemaat === no_jemaat);
  if (memberPelayan) {
    serviceScore = Math.min(memberPelayan.total_pelayanan / 50, 1) * 40;
  }

  const memberEvents = event_participation.filter(ep => ep.no_jemaat === no_jemaat);
  const eventScore = Math.min(memberEvents.length / 8, 1) * 30;

  let statusScore = 20;
  const memberHistory = statusHistory
    .filter(r => r.no_jemaat === no_jemaat)
    .sort((a, b) => new Date(b.changed_at) - new Date(a.changed_at));
  if (memberHistory.length > 0) {
    if (memberHistory[0].status === 'Active') statusScore = 20;
    else if (memberHistory[0].status === 'No Information') statusScore = 10;
    else if (memberHistory[0].status === 'Inactive') statusScore = 5;
    else statusScore = 0;

    if (memberHistory.length > 2) statusScore *= 0.7;
  }

  let versatilityScore = 0;
  if (memberPelayan) {
    const ministryCount = [memberPelayan.is_wl, memberPelayan.is_singer, memberPelayan.is_pianis, memberPelayan.is_saxophone, memberPelayan.is_filler, memberPelayan.is_bass_gitar, memberPelayan.is_drum, memberPelayan.is_mulmed, memberPelayan.is_sound, memberPelayan.is_caringteam, memberPelayan.is_connexion_crew, memberPelayan.is_supporting_crew, memberPelayan.is_cforce, memberPelayan.is_cg_leader, memberPelayan.is_community_pic].filter(Boolean).length;
    versatilityScore = Math.min(ministryCount / 4, 1) * 10;
  }

  return Math.round(serviceScore + eventScore + statusScore + versatilityScore);
}

export async function getAverageEngagementScore() {
  const scores = await Promise.all(members.map(m => getMemberEngagementScore(m.no_jemaat)));
  const total = scores.reduce((sum, s) => sum + s, 0);
  return Math.round(total / scores.length);
}

function getCareVisitData() {
  const visits = [];
  const now = new Date('2026-04-03');

  for (let i = 0; i < 90; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    const visitCount = Math.floor(Math.random() * 4);
    if (visitCount > 0) {
      const dayMembers = [...members].sort(() => Math.random() - 0.5).slice(0, visitCount);
      dayMembers.forEach(member => {
        visits.push({
          date: dateStr,
          no_jemaat: member.no_jemaat,
          nama_jemaat: member.nama_jemaat,
          visitType: randomItem(['Home Visit', 'Hospital Visit', 'Phone Call', 'Coffee Meeting']),
          notes: `${member.nama_jemaat} - kunjungan rutin`,
        });
      });
    }
  }

  return visits.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ============================================================
// EXPORTS (commented out - using direct exports from functions)
// ============================================================

export {
//   // Raw data
  members,
  cgfGroups,
  cgfMembers,
  cgfAttendance,
  pelayan,
  pelayananInfo,
  cnx_jemaat_status_history,
  event_history,
  event_participation,
//
//   // Constants
  GENDERS,
  DOMISILI_AREAS,
  CGF_INTEREST,
  KULIAH_KERJA,
  ATTENDANCE_STATUS,
  CGF_NAMES,
//
//   // Helper functions
  getMembers,
  getMemberById,
  getEvents,
  getEventById,
  getCGFGroups,
  getCGFGroupById,
  getCGFMembers,
  getAttendance,
  getPelayananInfo,
  getPelayananInfoById,
  // getPelayan,
  // getPelayananById,
  // getDashboardKPIs,
  // getGenderDistribution,
  getAgeDistribution,
  getDomisiliDistribution,
  // getCGFSizes,
  getAttendanceTrend,
  getCGFInterestFunnel,
  getKuliahKerjaRatio,
  getBirthdayMembers,
  // getStatusDistribution, // now exported directly from function definition
  // getStatusTrend,
  // getMinistryParticipation,
  // getTotalServingMembers,
  // getServingPercentage,
  // getRecentStatusChanges,
  // getAtRiskMembers,
  // getServiceFrequencyDistribution,
  // getUpcomingEvents,
  // getWorshipTeamComposition,
  // getEventAttendanceTrend,
  // getMultiSkillDistribution,
  // getCGHealthData,
  // getMemberEngagementScore,
  // getAverageEngagementScore,
  getCareVisitData,
};