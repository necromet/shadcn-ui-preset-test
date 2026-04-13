import { Router, Request, Response, NextFunction } from 'express';
import { validate } from './validators';
import * as schemas from './validators';
import { AttendanceModel } from '../models';

const router = Router();

/**
 * Get all attendance records
 * GET /attendance
 */
router.get('/attendance', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const filters: Record<string, unknown> = {};
    if (req.query.cg_id) filters.cg_id = req.query.cg_id;
    if (req.query.tanggal) filters.tanggal = req.query.tanggal;
    if (req.query.keterangan) filters.keterangan = req.query.keterangan;
    if (req.query.start_date) filters.start_date = req.query.start_date;
    if (req.query.end_date) filters.end_date = req.query.end_date;

    const result = await AttendanceModel.getAll(page, limit, filters);

    res.json({
      success: true,
      data: result.data,
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Record attendance
 * POST /attendance
 */
router.post('/attendance', validate(schemas.AttendanceCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attendance = await AttendanceModel.create(req.body);

    res.status(201).json({
      success: true,
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Bulk record attendance
 * POST /attendance/bulk
 */
router.post('/attendance/bulk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cg_id, tanggal, records } = req.body;

    if (!cg_id || !tanggal || !records || !Array.isArray(records)) {
      res.status(400).json({
        success: false,
        error: { code: 400, message: 'Missing required fields: cg_id, tanggal, records' },
      });
      return;
    }

    const validKeterangan = ['hadir', 'izin', 'tidak_hadir', 'tamu'];
    const filteredRecords = records.filter(
      (r: { no_jemaat: number; keterangan: string }) =>
        r.no_jemaat && r.keterangan && validKeterangan.includes(r.keterangan),
    );

    if (filteredRecords.length === 0) {
      res.status(400).json({
        success: false,
        error: { code: 400, message: 'No valid attendance records provided' },
      });
      return;
    }

    const created = await AttendanceModel.bulkCreate(cg_id, tanggal, filteredRecords);

    res.status(201).json({
      success: true,
      data: created,
      message: `Created ${created.length} attendance records`,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get attendance record by ID
 * GET /attendance/:id
 */
router.get('/attendance/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const attendance = await AttendanceModel.getById(id);

    if (!attendance) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Attendance record not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update attendance record
 * PUT /attendance/:id
 */
router.put('/attendance/:id', validate(schemas.AttendanceUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const attendance = await AttendanceModel.update(id, req.body);

    if (!attendance) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Attendance record not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: attendance,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Delete attendance record
 * DELETE /attendance/:id
 */
router.delete('/attendance/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await AttendanceModel.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Attendance record not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
