import { Router, Request, Response, NextFunction } from 'express';
import { validate } from './validators';
import * as schemas from './validators';
import { StatusModel } from '../models';

const router = Router();

/**
 * Get all status records
 * GET /status-history
 */
router.get('/status-history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await StatusModel.getAll(page, limit);

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
 * Create status change record
 * POST /status-history
 */
router.post('/status-history', validate(schemas.StatusHistoryCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statusRecord = await StatusModel.create(req.body);

    res.status(201).json({
      success: true,
      data: statusRecord,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get status history by ID
 * GET /status-history/:id
 */
router.get('/status-history/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const statusRecord = await StatusModel.getById(id);

    if (!statusRecord) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Status record not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: statusRecord,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update status history
 * PUT /status-history/:id
 */
router.put('/status-history/:id', validate(schemas.StatusHistoryUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const statusRecord = await StatusModel.update(id, req.body);

    if (!statusRecord) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Status record not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: statusRecord,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Delete status history
 * DELETE /status-history/:id
 */
router.delete('/status-history/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await StatusModel.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Status record not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * Get status history for a member
 * GET /members/:no_jemaat/status-history
 */
router.get('/members/:no_jemaat/status-history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const records = await StatusModel.getByMember(no_jemaat);

    res.json({
      success: true,
      data: records,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
