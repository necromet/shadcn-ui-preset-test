import { z } from 'zod';

// Auto-generated Zod validation schemas
// Generated from: openapi.yaml

export const SuccessMessageSchema = z.object({
  success: z.boolean().optional(),
  message: z.string().optional(),
});
export type SuccessMessage = z.infer<typeof SuccessMessageSchema>;

export const ErrorResponseSchema = z.object({
  success: z.boolean().optional(),
  error: z.object({
  code: z.number().int().optional(),
  message: z.string().optional(),
  details: z.array(z.object({
  field: z.string().optional(),
  message: z.string().optional(),
})).optional(),
}).optional(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const PaginationSchema = z.object({
  page: z.number().int().optional(),
  limit: z.number().int().optional(),
  total: z.number().int().optional(),
  totalPages: z.number().int().optional(),
});
export type Pagination = z.infer<typeof PaginationSchema>;

export const MemberSchema = z.object({
  no_jemaat: z.number().int().optional(),
  nama_jemaat: z.string().optional(),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
  tanggal_lahir: z.string().optional(),
  tahun_lahir: z.number().int().optional(),
  bulan_lahir: z.number().int().min(1).max(12).optional(),
  kuliah_kerja: z.string().optional(),
  no_handphone: z.string().optional(),
  ketertarikan_cgf: z.string().optional(),
  nama_cgf: z.string().optional(),
  kategori_domisili: z.string().optional(),
  alamat_domisili: z.string().optional(),
});
export type Member = z.infer<typeof MemberSchema>;

export const MemberCreateSchema = z.object({
  nama_jemaat: z.string().min(2),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
  tanggal_lahir: z.string(),
  tahun_lahir: z.number().int().optional(),
  bulan_lahir: z.number().int().min(1).max(12).optional(),
  kuliah_kerja: z.string().optional(),
  no_handphone: z.string().optional(),
  ketertarikan_cgf: z.string().optional(),
  nama_cgf: z.string().optional(),
  kategori_domisili: z.string().optional(),
  alamat_domisili: z.string().optional(),
});
export type MemberCreate = z.infer<typeof MemberCreateSchema>;

export const MemberUpdateSchema = z.object({
  nama_jemaat: z.string().min(2),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
  tanggal_lahir: z.string(),
  tahun_lahir: z.number().int().optional(),
  bulan_lahir: z.number().int().min(1).max(12).optional(),
  kuliah_kerja: z.string().optional(),
  no_handphone: z.string().optional(),
  ketertarikan_cgf: z.string().optional(),
  nama_cgf: z.string().optional(),
  kategori_domisili: z.string().optional(),
  alamat_domisili: z.string().optional(),
});
export type MemberUpdate = z.infer<typeof MemberUpdateSchema>;

export const MemberPartialUpdateSchema = z.object({
  nama_jemaat: z.string().min(2).optional(),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
  tanggal_lahir: z.string().optional(),
  tahun_lahir: z.number().int().optional(),
  bulan_lahir: z.number().int().min(1).max(12).optional(),
  kuliah_kerja: z.string().optional(),
  no_handphone: z.string().optional(),
  ketertarikan_cgf: z.string().optional(),
  nama_cgf: z.string().optional(),
  kategori_domisili: z.string().optional(),
  alamat_domisili: z.string().optional(),
});
export type MemberPartialUpdate = z.infer<typeof MemberPartialUpdateSchema>;

export const MemberResponseSchema = z.object({
  success: z.boolean().optional(),
  data: MemberSchema.optional(),
});
export type MemberResponse = z.infer<typeof MemberResponseSchema>;

export const MemberListResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(MemberSchema).optional(),
  pagination: PaginationSchema.optional(),
});
export type MemberListResponse = z.infer<typeof MemberListResponseSchema>;

export const CGFSchema = z.object({
  id: z.string().min(5).max(5).optional(),
  nama_cgf: z.string().optional(),
  lokasi_1: z.string().optional(),
  lokasi_2: z.string().optional(),
  hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']).optional(),
});
export type CGF = z.infer<typeof CGFSchema>;

export const CGFCreateSchema = z.object({
  id: z.string().min(5).max(5),
  nama_cgf: z.string(),
  lokasi_1: z.string(),
  lokasi_2: z.string().optional(),
  hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']),
});
export type CGFCreate = z.infer<typeof CGFCreateSchema>;

export const CGFUpdateSchema = z.object({
  nama_cgf: z.string(),
  lokasi_1: z.string(),
  lokasi_2: z.string().optional(),
  hari: z.enum(['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']),
});
export type CGFUpdate = z.infer<typeof CGFUpdateSchema>;

export const CGFResponseSchema = z.object({
  success: z.boolean().optional(),
  data: CGFSchema.optional(),
});
export type CGFResponse = z.infer<typeof CGFResponseSchema>;

export const CGFListResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(CGFSchema).optional(),
  pagination: PaginationSchema.optional(),
});
export type CGFListResponse = z.infer<typeof CGFListResponseSchema>;

export const CGFMemberSchema = z.object({
  no_jemaat: z.number().int().optional(),
  nama_cgf: z.string().optional(),
  is_leader: z.boolean().optional(),
  member: MemberSchema.optional(),
});
export type CGFMember = z.infer<typeof CGFMemberSchema>;

export const CGFMemberCreateSchema = z.object({
  no_jemaat: z.number().int(),
  nama_cgf: z.string(),
  is_leader: z.boolean().optional(),
});
export type CGFMemberCreate = z.infer<typeof CGFMemberCreateSchema>;

export const CGFMemberUpdateSchema = z.object({
  nama_cgf: z.string().optional(),
  is_leader: z.boolean().optional(),
});
export type CGFMemberUpdate = z.infer<typeof CGFMemberUpdateSchema>;

export const CGFMemberResponseSchema = z.object({
  success: z.boolean().optional(),
  data: CGFMemberSchema.optional(),
});
export type CGFMemberResponse = z.infer<typeof CGFMemberResponseSchema>;

export const CGFMemberListResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(CGFMemberSchema).optional(),
  pagination: PaginationSchema.optional(),
});
export type CGFMemberListResponse = z.infer<typeof CGFMemberListResponseSchema>;

export const AttendanceSchema = z.object({
  id: z.number().int().optional(),
  no_jemaat: z.number().int().optional(),
  cg_id: z.string().optional(),
  tanggal: z.string().optional(),
  keterangan: z.enum(['hadir', 'izin', 'tidak_hadir', 'tamu']).optional(),
  member: MemberSchema.optional(),
});
export type Attendance = z.infer<typeof AttendanceSchema>;

export const AttendanceCreateSchema = z.object({
  no_jemaat: z.number().int(),
  cg_id: z.string(),
  tanggal: z.string(),
  keterangan: z.enum(['hadir', 'izin', 'tidak_hadir', 'tamu']),
});
export type AttendanceCreate = z.infer<typeof AttendanceCreateSchema>;

export const AttendanceRecordSchema = z.object({
  no_jemaat: z.number().int(),
  keterangan: z.enum(['hadir', 'izin', 'tidak_hadir', 'tamu']),
});
export type AttendanceRecord = z.infer<typeof AttendanceRecordSchema>;

export const AttendanceUpdateSchema = z.object({
  keterangan: z.enum(['hadir', 'izin', 'tidak_hadir', 'tamu']).optional(),
  tanggal: z.string().optional(),
});
export type AttendanceUpdate = z.infer<typeof AttendanceUpdateSchema>;

export const AttendanceResponseSchema = z.object({
  success: z.boolean().optional(),
  data: AttendanceSchema.optional(),
});
export type AttendanceResponse = z.infer<typeof AttendanceResponseSchema>;

export const AttendanceListResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(AttendanceSchema).optional(),
  pagination: PaginationSchema.optional(),
});
export type AttendanceListResponse = z.infer<typeof AttendanceListResponseSchema>;

export const MinistrySchema = z.object({
  pelayanan_id: z.string().min(5).max(5).optional(),
  nama_pelayanan: z.string().optional(),
});
export type Ministry = z.infer<typeof MinistrySchema>;

export const MinistryCreateSchema = z.object({
  pelayanan_id: z.string().min(5).max(5),
  nama_pelayanan: z.string(),
});
export type MinistryCreate = z.infer<typeof MinistryCreateSchema>;

export const MinistryUpdateSchema = z.object({
  nama_pelayanan: z.string(),
});
export type MinistryUpdate = z.infer<typeof MinistryUpdateSchema>;

export const MinistryResponseSchema = z.object({
  success: z.boolean().optional(),
  data: MinistrySchema.optional(),
});
export type MinistryResponse = z.infer<typeof MinistryResponseSchema>;

export const MinistryListResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(MinistrySchema).optional(),
  pagination: PaginationSchema.optional(),
});
export type MinistryListResponse = z.infer<typeof MinistryListResponseSchema>;

export const PelayanSchema = z.object({
  no_jemaat: z.number().int().optional(),
  nama_jemaat: z.string().optional(),
  is_wl: z.boolean().optional(),
  is_singer: z.boolean().optional(),
  is_pianis: z.boolean().optional(),
  is_saxophone: z.boolean().optional(),
  is_filler: z.boolean().optional(),
  is_bass_gitar: z.boolean().optional(),
  is_drum: z.boolean().optional(),
  is_mulmed: z.boolean().optional(),
  is_sound: z.boolean().optional(),
  is_caringteam: z.boolean().optional(),
  is_connexion_crew: z.boolean().optional(),
  is_supporting_crew: z.boolean().optional(),
  is_cforce: z.boolean().optional(),
  is_cg_leader: z.boolean().optional(),
  is_community_pic: z.boolean().optional(),
  total_pelayanan: z.number().int().optional(),
});
export type Pelayan = z.infer<typeof PelayanSchema>;

export const PelayanCreateSchema = z.object({
  no_jemaat: z.number().int(),
  nama_jemaat: z.string(),
  is_wl: z.boolean().optional(),
  is_singer: z.boolean().optional(),
  is_pianis: z.boolean().optional(),
  is_saxophone: z.boolean().optional(),
  is_filler: z.boolean().optional(),
  is_bass_gitar: z.boolean().optional(),
  is_drum: z.boolean().optional(),
  is_mulmed: z.boolean().optional(),
  is_sound: z.boolean().optional(),
  is_caringteam: z.boolean().optional(),
  is_connexion_crew: z.boolean().optional(),
  is_supporting_crew: z.boolean().optional(),
  is_cforce: z.boolean().optional(),
  is_cg_leader: z.boolean().optional(),
  is_community_pic: z.boolean().optional(),
});
export type PelayanCreate = z.infer<typeof PelayanCreateSchema>;

export const PelayanUpdateSchema = z.object({
  nama_jemaat: z.string(),
  is_wl: z.boolean().optional(),
  is_singer: z.boolean().optional(),
  is_pianis: z.boolean().optional(),
  is_saxophone: z.boolean().optional(),
  is_filler: z.boolean().optional(),
  is_bass_gitar: z.boolean().optional(),
  is_drum: z.boolean().optional(),
  is_mulmed: z.boolean().optional(),
  is_sound: z.boolean().optional(),
  is_caringteam: z.boolean().optional(),
  is_connexion_crew: z.boolean().optional(),
  is_supporting_crew: z.boolean().optional(),
  is_cforce: z.boolean().optional(),
  is_cg_leader: z.boolean().optional(),
  is_community_pic: z.boolean().optional(),
});
export type PelayanUpdate = z.infer<typeof PelayanUpdateSchema>;

export const PelayanPartialUpdateSchema = z.object({
  nama_jemaat: z.string().optional(),
  is_wl: z.boolean().optional(),
  is_singer: z.boolean().optional(),
  is_pianis: z.boolean().optional(),
  is_saxophone: z.boolean().optional(),
  is_filler: z.boolean().optional(),
  is_bass_gitar: z.boolean().optional(),
  is_drum: z.boolean().optional(),
  is_mulmed: z.boolean().optional(),
  is_sound: z.boolean().optional(),
  is_caringteam: z.boolean().optional(),
  is_connexion_crew: z.boolean().optional(),
  is_supporting_crew: z.boolean().optional(),
  is_cforce: z.boolean().optional(),
  is_cg_leader: z.boolean().optional(),
  is_community_pic: z.boolean().optional(),
});
export type PelayanPartialUpdate = z.infer<typeof PelayanPartialUpdateSchema>;

export const PelayanResponseSchema = z.object({
  success: z.boolean().optional(),
  data: PelayanSchema.optional(),
});
export type PelayanResponse = z.infer<typeof PelayanResponseSchema>;

export const PelayanListResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(PelayanSchema).optional(),
  pagination: PaginationSchema.optional(),
});
export type PelayanListResponse = z.infer<typeof PelayanListResponseSchema>;

export const StatusHistorySchema = z.object({
  id: z.number().int().optional(),
  no_jemaat: z.number().int().optional(),
  status: z.enum(['Active', 'Inactive', 'Sabbatical', 'Moved']).optional(),
  changed_at: z.string().optional(),
  reason: z.string().optional(),
  member: MemberSchema.optional(),
});
export type StatusHistory = z.infer<typeof StatusHistorySchema>;

export const StatusHistoryCreateSchema = z.object({
  no_jemaat: z.number().int(),
  status: z.enum(['Active', 'Inactive', 'Sabbatical', 'Moved']),
  reason: z.string().optional(),
});
export type StatusHistoryCreate = z.infer<typeof StatusHistoryCreateSchema>;

export const StatusHistoryUpdateSchema = z.object({
  status: z.enum(['Active', 'Inactive', 'Sabbatical', 'Moved']).optional(),
  reason: z.string().optional(),
});
export type StatusHistoryUpdate = z.infer<typeof StatusHistoryUpdateSchema>;

export const StatusHistoryResponseSchema = z.object({
  success: z.boolean().optional(),
  data: StatusHistorySchema.optional(),
});
export type StatusHistoryResponse = z.infer<typeof StatusHistoryResponseSchema>;

export const StatusHistoryListResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(StatusHistorySchema).optional(),
  pagination: PaginationSchema.optional(),
});
export type StatusHistoryListResponse = z.infer<typeof StatusHistoryListResponseSchema>;

export const EventSchema = z.object({
  event_id: z.number().int().optional(),
  event_name: z.string().optional(),
  event_date: z.string().optional(),
  category: z.enum(['Camp', 'Retreat', 'Quarterly', 'Monthly', 'Special']).optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});
export type Event = z.infer<typeof EventSchema>;

export const EventCreateSchema = z.object({
  event_name: z.string(),
  event_date: z.string(),
  category: z.enum(['Camp', 'Retreat', 'Quarterly', 'Monthly', 'Special']),
  location: z.string().optional(),
  description: z.string().optional(),
});
export type EventCreate = z.infer<typeof EventCreateSchema>;

export const EventUpdateSchema = z.object({
  event_name: z.string(),
  event_date: z.string(),
  category: z.enum(['Camp', 'Retreat', 'Quarterly', 'Monthly', 'Special']),
  location: z.string().optional(),
  description: z.string().optional(),
});
export type EventUpdate = z.infer<typeof EventUpdateSchema>;

export const EventResponseSchema = z.object({
  success: z.boolean().optional(),
  data: EventSchema.optional(),
});
export type EventResponse = z.infer<typeof EventResponseSchema>;

export const EventListResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(EventSchema).optional(),
  pagination: PaginationSchema.optional(),
});
export type EventListResponse = z.infer<typeof EventListResponseSchema>;

export const EventParticipationSchema = z.object({
  id: z.number().int().optional(),
  event_id: z.number().int().optional(),
  no_jemaat: z.number().int().optional(),
  role: z.enum(['Peserta', 'Panitia', 'Volunteer']).optional(),
  registered_at: z.string().optional(),
  event: EventSchema.optional(),
  member: MemberSchema.optional(),
});
export type EventParticipation = z.infer<typeof EventParticipationSchema>;

export const EventParticipationCreateSchema = z.object({
  event_id: z.number().int(),
  no_jemaat: z.number().int(),
  role: z.enum(['Peserta', 'Panitia', 'Volunteer']),
});
export type EventParticipationCreate = z.infer<typeof EventParticipationCreateSchema>;

export const EventParticipationUpdateSchema = z.object({
  role: z.enum(['Peserta', 'Panitia', 'Volunteer']).optional(),
});
export type EventParticipationUpdate = z.infer<typeof EventParticipationUpdateSchema>;

export const EventParticipationResponseSchema = z.object({
  success: z.boolean().optional(),
  data: EventParticipationSchema.optional(),
});
export type EventParticipationResponse = z.infer<typeof EventParticipationResponseSchema>;

export const EventParticipationListResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.array(EventParticipationSchema).optional(),
  pagination: PaginationSchema.optional(),
});
export type EventParticipationListResponse = z.infer<typeof EventParticipationListResponseSchema>;

// Validation middleware factory
import { Request, Response, NextFunction } from "express";

export function validate<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: result.error.errors.map(e => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
      });
    }
    req.body = result.data;
    next();
  };
}