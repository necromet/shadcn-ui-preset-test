import { Router, Request, Response, NextFunction } from 'express';
import { validate } from './validators';
import * as schemas from './validators';
import { MembersModel } from '../models';

const router = Router();

/**
 * Get all members
 * GET /members
 */
router.get('/members', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const filters: Record<string, unknown> = {};
    if (req.query.jenis_kelamin) filters.jenis_kelamin = req.query.jenis_kelamin;
    if (req.query.kategori_domisili) filters.kategori_domisili = req.query.kategori_domisili;
    if (req.query.nama_cgf) filters.nama_cgf = req.query.nama_cgf;
    if (req.query.kuliah_kerja) filters.kuliah_kerja = req.query.kuliah_kerja;
    if (req.query.bulan_lahir) filters.bulan_lahir = parseInt(req.query.bulan_lahir as string, 10);

    const result = await MembersModel.getAll(page, limit, filters);

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
 * Create a new member
 * POST /members
 */
router.post('/members', validate(schemas.MemberCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const member = await MembersModel.create(req.body);

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get member by ID
 * GET /members/:no_jemaat
 */
router.get('/members/:no_jemaat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const member = await MembersModel.getById(no_jemaat);

    if (!member) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Member not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update member
 * PUT /members/:no_jemaat
 */
router.put('/members/:no_jemaat', validate(schemas.MemberUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const member = await MembersModel.update(no_jemaat, req.body);

    if (!member) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Member not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Partially update member
 * PATCH /members/:no_jemaat
 */
router.patch('/members/:no_jemaat', validate(schemas.MemberPartialUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const member = await MembersModel.update(no_jemaat, req.body);

    if (!member) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Member not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: member,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Delete member
 * DELETE /members/:no_jemaat
 */
router.delete('/members/:no_jemaat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const deleted = await MembersModel.delete(no_jemaat);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Member not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
