// Script to generate SQL INSERT statements for cgf_attendance table
// Based on mock.js data and schema definitions

const fs = require('fs');
const path = require('path');

// Import mock data (we'll extract the relevant parts)
// We need cgfMembers, cgfGroups, and the generation logic

// Data from mock.js (copied relevant parts)
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

// Generation logic from mock.js
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

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
        // Simulate non-members (using a range of IDs not in cgfMembers for simplicity, or just pick a random ID)
        // For this script, we'll skip adding guests to keep it simple based on provided data,
        // or we could add some if we had a full member list. The mock.js logic is complex here.
        // Let's strictly follow the loop logic for members.
        // To be fully accurate to mock.js, we need the full 'members' list to find non-members.
        // But the user asked based on cgf_members and cgf_info.
        // I will omit the guest logic for simplicity as it requires the full 'members' list which isn't fully provided in the prompt context (only snippets).
      }
    }
  }

  return records.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
}

const cgfAttendance = generateAttendanceRecords();

// Generate SQL
let sql = "-- SQL Insert Statements for cgf_attendance\n";
sql += "-- Generated based on cgf_members and cgf_info data\n\n";

cgfAttendance.forEach(record => {
  // Convert numeric cg_id to string to match VARCHAR(5) schema in backend/migrations
  const cgIdStr = String(record.cg_id).padStart(2, '0'); // e.g., 1 -> "01", or just "1"
  // Let's use simple string conversion "1", "2" etc. as per typical mock data usage
  // The schema VARCHAR(5) allows enough space.
  
  sql += `INSERT INTO cgf_attendance (no_jemaat, cg_id, tanggal, keterangan, created_at) VALUES (\n`;
  sql += `  ${record.no_jemaat},\n`;
  sql += `  '${record.cg_id}',\n`; // Using numeric string as per mock.js cg_id usage
  sql += `  '${record.tanggal}',\n`;
  sql += `  '${record.keterangan}',\n`;
  sql += `  NOW()\n`;
  sql += `);\n`;
});

// Write to file
const outputPath = path.join(__dirname, 'cgf_attendance_insert.sql');
fs.writeFileSync(outputPath, sql);

console.log(`SQL file generated: ${outputPath}`);
console.log(`Total records: ${cgfAttendance.length}`);
