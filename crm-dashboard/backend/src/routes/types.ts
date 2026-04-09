// Auto-generated TypeScript types
// Generated from: openapi.yaml
// Date: 2026-04-06T21:20:50.934431

export interface SuccessMessage {
  success?: boolean;
  message?: string;
}

export interface ErrorResponse {
  success?: boolean;
  error?: {
  code?: number;
  message?: string;
  details?: {
  field?: string;
  message?: string;
}[];
};
}

export interface Pagination {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface Member {
  no_jemaat?: number;
  nama_jemaat?: string;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  tanggal_lahir?: string;
  tahun_lahir?: number;
  bulan_lahir?: number;
  kuliah_kerja?: string;
  no_handphone?: string;
  ketertarikan_cgf?: string;
  nama_cgf?: string;
  kategori_domisili?: string;
  alamat_domisili?: string;
}

export interface MemberCreate {
  nama_jemaat: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  tanggal_lahir: string;
  tahun_lahir?: number;
  bulan_lahir?: number;
  kuliah_kerja?: string;
  no_handphone?: string;
  ketertarikan_cgf?: string;
  nama_cgf?: string;
  kategori_domisili?: string;
  alamat_domisili?: string;
}

export interface MemberUpdate {
  nama_jemaat: string;
  jenis_kelamin: 'Laki-laki' | 'Perempuan';
  tanggal_lahir: string;
  tahun_lahir?: number;
  bulan_lahir?: number;
  kuliah_kerja?: string;
  no_handphone?: string;
  ketertarikan_cgf?: string;
  nama_cgf?: string;
  kategori_domisili?: string;
  alamat_domisili?: string;
}

export interface MemberPartialUpdate {
  nama_jemaat?: string;
  jenis_kelamin?: 'Laki-laki' | 'Perempuan';
  tanggal_lahir?: string;
  tahun_lahir?: number;
  bulan_lahir?: number;
  kuliah_kerja?: string;
  no_handphone?: string;
  ketertarikan_cgf?: string;
  nama_cgf?: string;
  kategori_domisili?: string;
  alamat_domisili?: string;
}

export interface MemberResponse {
  success?: boolean;
  data?: Member;
}

export interface MemberListResponse {
  success?: boolean;
  data?: Member[];
  pagination?: Pagination;
}

export interface CGF {
  id?: string;
  nama_cgf?: string;
  lokasi_1?: string;
  lokasi_2?: string;
  hari?: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
}

export interface CGFCreate {
  id: string;
  nama_cgf: string;
  lokasi_1: string;
  lokasi_2?: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
}

export interface CGFUpdate {
  nama_cgf: string;
  lokasi_1: string;
  lokasi_2?: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
}

export interface CGFResponse {
  success?: boolean;
  data?: CGF;
}

export interface CGFListResponse {
  success?: boolean;
  data?: CGF[];
  pagination?: Pagination;
}

export interface CGFMember {
  no_jemaat?: number;
  nama_cgf?: string;
  is_leader?: boolean;
  member?: Member;
}

export interface CGFMemberCreate {
  no_jemaat: number;
  nama_cgf: string;
  is_leader?: boolean;
}

export interface CGFMemberUpdate {
  nama_cgf?: string;
  is_leader?: boolean;
}

export interface CGFMemberResponse {
  success?: boolean;
  data?: CGFMember;
}

export interface CGFMemberListResponse {
  success?: boolean;
  data?: CGFMember[];
  pagination?: Pagination;
}

export interface Attendance {
  id?: number;
  no_jemaat?: number;
  cg_id?: string;
  tanggal?: string;
  keterangan?: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
  member?: Member;
}

export interface AttendanceCreate {
  no_jemaat: number;
  cg_id: string;
  tanggal: string;
  keterangan: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
}

export interface AttendanceRecord {
  no_jemaat: number;
  keterangan: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
}

export interface AttendanceUpdate {
  keterangan?: 'hadir' | 'izin' | 'tidak_hadir' | 'tamu';
  tanggal?: string;
}

export interface AttendanceResponse {
  success?: boolean;
  data?: Attendance;
}

export interface AttendanceListResponse {
  success?: boolean;
  data?: Attendance[];
  pagination?: Pagination;
}

export interface Ministry {
  pelayanan_id?: string;
  nama_pelayanan?: string;
}

export interface MinistryCreate {
  pelayanan_id: string;
  nama_pelayanan: string;
}

export interface MinistryUpdate {
  nama_pelayanan: string;
}

export interface MinistryResponse {
  success?: boolean;
  data?: Ministry;
}

export interface MinistryListResponse {
  success?: boolean;
  data?: Ministry[];
  pagination?: Pagination;
}

export interface Pelayan {
  no_jemaat?: number;
  nama_jemaat?: string;
  is_wl?: boolean;
  is_singer?: boolean;
  is_pianis?: boolean;
  is_saxophone?: boolean;
  is_filler?: boolean;
  is_bass_gitar?: boolean;
  is_drum?: boolean;
  is_mulmed?: boolean;
  is_sound?: boolean;
  is_caringteam?: boolean;
  is_connexion_crew?: boolean;
  is_supporting_crew?: boolean;
  is_cforce?: boolean;
  is_cg_leader?: boolean;
  is_community_pic?: boolean;
  total_pelayanan?: number;
}

export interface PelayanCreate {
  no_jemaat: number;
  nama_jemaat: string;
  is_wl?: boolean;
  is_singer?: boolean;
  is_pianis?: boolean;
  is_saxophone?: boolean;
  is_filler?: boolean;
  is_bass_gitar?: boolean;
  is_drum?: boolean;
  is_mulmed?: boolean;
  is_sound?: boolean;
  is_caringteam?: boolean;
  is_connexion_crew?: boolean;
  is_supporting_crew?: boolean;
  is_cforce?: boolean;
  is_cg_leader?: boolean;
  is_community_pic?: boolean;
}

export interface PelayanUpdate {
  nama_jemaat: string;
  is_wl?: boolean;
  is_singer?: boolean;
  is_pianis?: boolean;
  is_saxophone?: boolean;
  is_filler?: boolean;
  is_bass_gitar?: boolean;
  is_drum?: boolean;
  is_mulmed?: boolean;
  is_sound?: boolean;
  is_caringteam?: boolean;
  is_connexion_crew?: boolean;
  is_supporting_crew?: boolean;
  is_cforce?: boolean;
  is_cg_leader?: boolean;
  is_community_pic?: boolean;
}

export interface PelayanPartialUpdate {
  nama_jemaat?: string;
  is_wl?: boolean;
  is_singer?: boolean;
  is_pianis?: boolean;
  is_saxophone?: boolean;
  is_filler?: boolean;
  is_bass_gitar?: boolean;
  is_drum?: boolean;
  is_mulmed?: boolean;
  is_sound?: boolean;
  is_caringteam?: boolean;
  is_connexion_crew?: boolean;
  is_supporting_crew?: boolean;
  is_cforce?: boolean;
  is_cg_leader?: boolean;
  is_community_pic?: boolean;
}

export interface PelayanResponse {
  success?: boolean;
  data?: Pelayan;
}

export interface PelayanListResponse {
  success?: boolean;
  data?: Pelayan[];
  pagination?: Pagination;
}

export interface StatusHistory {
  id?: number;
  no_jemaat?: number;
  status?: 'Active' | 'Inactive' | 'No Information' | 'Moved';
  changed_at?: string;
  reason?: string;
  member?: Member;
}

export interface StatusHistoryCreate {
  no_jemaat: number;
  status: 'Active' | 'Inactive' | 'No Information' | 'Moved';
  reason?: string;
}

export interface StatusHistoryUpdate {
  status?: 'Active' | 'Inactive' | 'No Information' | 'Moved';
  reason?: string;
}

export interface StatusHistoryResponse {
  success?: boolean;
  data?: StatusHistory;
}

export interface StatusHistoryListResponse {
  success?: boolean;
  data?: StatusHistory[];
  pagination?: Pagination;
}

export interface Event {
  event_id?: number;
  event_name?: string;
  event_date?: string;
  category?: 'Camp' | 'Retreat' | 'Quarterly' | 'Monthly' | 'Special';
  location?: string;
  description?: string;
}

export interface EventCreate {
  event_name: string;
  event_date: string;
  category: 'Camp' | 'Retreat' | 'Quarterly' | 'Monthly' | 'Special';
  location?: string;
  description?: string;
}

export interface EventUpdate {
  event_name: string;
  event_date: string;
  category: 'Camp' | 'Retreat' | 'Quarterly' | 'Monthly' | 'Special';
  location?: string;
  description?: string;
}

export interface EventResponse {
  success?: boolean;
  data?: Event;
}

export interface EventListResponse {
  success?: boolean;
  data?: Event[];
  pagination?: Pagination;
}

export interface EventParticipation {
  id?: number;
  event_id?: number;
  no_jemaat?: number;
  role?: 'Peserta' | 'Panitia' | 'Volunteer';
  registered_at?: string;
  event?: Event;
  member?: Member;
}

export interface EventParticipationCreate {
  event_id: number;
  no_jemaat: number;
  role: 'Peserta' | 'Panitia' | 'Volunteer';
}

export interface EventParticipationUpdate {
  role?: 'Peserta' | 'Panitia' | 'Volunteer';
}

export interface EventParticipationResponse {
  success?: boolean;
  data?: EventParticipation;
}

export interface EventParticipationListResponse {
  success?: boolean;
  data?: EventParticipation[];
  pagination?: Pagination;
}

export interface PostAttendanceBulkRequest {
  cg_id: string;
  tanggal: string;
  records: AttendanceRecord[];
}

export interface PostAttendanceBulkResponse {
  success?: boolean;
  data?: Attendance[];
  message?: string;
}

export interface GetAnalyticsDashboardResponse {
  success?: boolean;
  data?: {
  total_members?: number;
  active_members?: number;
  inactive_members?: number;
  new_members_this_month?: number;
  total_cgf_groups?: number;
  total_ministry_members?: number;
  upcoming_events?: number;
  attendance_rate_this_month?: number;
};
}

export interface GetAnalyticsMembersDistributionResponse {
  success?: boolean;
  data?: {
  label?: string;
  value?: number;
  percentage?: number;
}[];
}

export interface GetAnalyticsMembersTrendsResponse {
  success?: boolean;
  data?: {
  period?: string;
  new_members?: number;
  total_members?: number;
  active_members?: number;
}[];
}

export interface GetAnalyticsAttendanceSummaryResponse {
  success?: boolean;
  data?: {
  total_records?: number;
  hadir?: number;
  izin?: number;
  tidak_hadir?: number;
  tamu?: number;
  attendance_rate?: number;
};
}

export interface GetAnalyticsAttendanceTrendsResponse {
  success?: boolean;
  data?: {
  period?: string;
  total_expected?: number;
  total_present?: number;
  attendance_rate?: number;
}[];
}

export interface GetAnalyticsCgfSummaryResponse {
  success?: boolean;
  data?: {
  total_groups?: number;
  total_members_assigned?: number;
  average_group_size?: number;
  groups_by_day?: Record<string, unknown>;
  top_attendance_groups?: {
  cg_id?: string;
  nama_cgf?: string;
  attendance_rate?: number;
}[];
};
}

export interface GetAnalyticsMinistrySummaryResponse {
  success?: boolean;
  data?: {
  total_ministry_members?: number;
  role_distribution?: {
  role?: string;
  count?: number;
}[];
  multi_role_members?: number;
};
}

export interface GetAnalyticsEventsSummaryResponse {
  success?: boolean;
  data?: {
  total_events?: number;
  events_by_category?: Record<string, unknown>;
  total_participants?: number;
  average_participants_per_event?: number;
};
}

export interface GetAnalyticsMembersBirthdayResponse {
  success?: boolean;
  data?: {
  no_jemaat?: number;
  nama_jemaat?: string;
  tanggal_lahir?: string;
  upcoming_birthday?: string;
  age_turning?: number;
}[];
}
