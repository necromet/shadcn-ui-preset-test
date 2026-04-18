import { Router, Request, Response, NextFunction } from 'express';
import { validate } from './validators';
import * as schemas from './validators';
import { MinistryModel } from '../models';

const router = Router();

// --- Ministry Type Endpoints ---

/**
 * Get pelayanan info (all ministry types)
 * GET /ministry/pelayanan/info
 */
router.get('/ministry/pelayanan/info', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await MinistryModel.getAllMinistryTypes(1, 100);
    res.json({
      success: true,
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get all ministry types
 * GET /ministry/types
 */
router.get('/ministry/types', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await MinistryModel.getAllMinistryTypes(page, limit);

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
 * Create a new ministry type
 * POST /ministry/types
 */
router.post('/ministry/types', validate(schemas.MinistryCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ministryType = await MinistryModel.createMinistryType(req.body);

    res.status(201).json({
      success: true,
      data: ministryType,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get ministry type by ID
 * GET /ministry/types/:pelayananId
 */
router.get('/ministry/types/:pelayananId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pelayananId } = req.params;
    const ministryType = await MinistryModel.getMinistryTypeById(pelayananId);

    if (!ministryType) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Ministry type not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: ministryType,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update ministry type
 * PUT /ministry/types/:pelayananId
 */
router.put('/ministry/types/:pelayananId', validate(schemas.MinistryUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pelayananId } = req.params;
    const ministryType = await MinistryModel.updateMinistryType(pelayananId, req.body);

    if (!ministryType) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Ministry type not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: ministryType,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Delete ministry type
 * DELETE /ministry/types/:pelayananId
 */
router.delete('/ministry/types/:pelayananId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pelayananId } = req.params;
    const deleted = await MinistryModel.deleteMinistryType(pelayananId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Ministry type not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// --- Pelayanan Stats (must be before :pelayananId route) ---

/**
 * Get pelayanan assignment counts
 * GET /ministry/pelayanan/stats
 */
router.get('/ministry/pelayanan/stats', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const counts = await MinistryModel.getPelayananCounts();
    res.json({
      success: true,
      data: counts,
    });
  } catch (err) {
    next(err);
  }
});

// --- Pelayan Endpoints ---

/**
 * Get all pelayan
 * GET /ministry/pelayan
 */
router.get('/ministry/pelayan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await MinistryModel.getAllPelayan(page, limit);

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
 * Add ministry member
 * POST /ministry/pelayan
 */
router.post('/ministry/pelayan', validate(schemas.PelayanCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const pelayan = await MinistryModel.createPelayan(req.body);

    res.status(201).json({
      success: true,
      data: pelayan,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get pelayan by ID
 * GET /ministry/pelayan/:no_jemaat
 */
router.get('/ministry/pelayan/:no_jemaat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const pelayan = await MinistryModel.getPelayanById(no_jemaat);

    if (!pelayan) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Pelayan not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: pelayan,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update pelayan
 * PUT /ministry/pelayan/:no_jemaat
 */
router.put('/ministry/pelayan/:no_jemaat', validate(schemas.PelayanUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const pelayan = await MinistryModel.updatePelayan(no_jemaat, req.body);

    if (!pelayan) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Pelayan not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: pelayan,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Partially update pelayan
 * PATCH /ministry/pelayan/:no_jemaat
 */
router.patch('/ministry/pelayan/:no_jemaat', validate(schemas.PelayanPartialUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const pelayan = await MinistryModel.updatePelayan(no_jemaat, req.body);

    if (!pelayan) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Pelayan not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: pelayan,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Remove pelayan
 * DELETE /ministry/pelayan/:no_jemaat
 */
router.delete('/ministry/pelayan/:no_jemaat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const deleted = await MinistryModel.deletePelayan(no_jemaat);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Pelayan not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// --- Pelayan-Pelayanan Junction Endpoints ---

/**
 * Get all pelayanan for a specific pelayan
 * GET /ministry/pelayan/:no_jemaat/pelayanan
 */
router.get('/ministry/pelayan/:no_jemaat/pelayanan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);

    // Verify pelayan exists
    const pelayan = await MinistryModel.getPelayanById(no_jemaat);
    if (!pelayan) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Pelayan not found' },
      });
      return;
    }

    const pelayananList = await MinistryModel.getAllPelayananForPelayan(no_jemaat);

    res.json({
      success: true,
      data: pelayananList,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Assign pelayanan to a pelayan (single or bulk)
 * POST /ministry/pelayan/:no_jemaat/pelayanan
 */
router.post('/ministry/pelayan/:no_jemaat/pelayanan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const { pelayanan_id, pelayanan_ids, updated_by } = req.body;

    // Verify pelayan exists
    const pelayan = await MinistryModel.getPelayanById(no_jemaat);
    if (!pelayan) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Pelayan not found' },
      });
      return;
    }

    // Bulk assignment
    if (pelayanan_ids && Array.isArray(pelayanan_ids)) {
      const result = await MinistryModel.bulkAssignPelayanan(no_jemaat, pelayanan_ids, updated_by);
      res.status(200).json({
        success: true,
        data: result,
      });
      return;
    }

    // Single assignment
    if (!pelayanan_id) {
      res.status(400).json({
        success: false,
        error: { code: 400, message: 'pelayanan_id is required' },
      });
      return;
    }

    const assignment = await MinistryModel.assignPelayanan(no_jemaat, pelayanan_id, updated_by);
    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Remove pelayanan from a pelayan (soft delete)
 * DELETE /ministry/pelayan/:no_jemaat/pelayanan/:pelayananId
 */
router.delete('/ministry/pelayan/:no_jemaat/pelayanan/:pelayananId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const { pelayananId } = req.params;
    const updated_by = req.body?.updated_by;

    const removed = await MinistryModel.removePelayanan(no_jemaat, pelayananId, updated_by);

    if (!removed) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Assignment not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * Bulk update pelayanan assignments for a pelayan
 * PATCH /ministry/pelayan/:no_jemaat/pelayanan
 */
router.patch('/ministry/pelayan/:no_jemaat/pelayanan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const { assign, remove, updated_by } = req.body;

    // Verify pelayan exists
    const pelayan = await MinistryModel.getPelayanById(no_jemaat);
    if (!pelayan) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Pelayan not found' },
      });
      return;
    }

    const result: { assigned?: unknown; removed?: unknown } = {};

    if (assign && Array.isArray(assign)) {
      result.assigned = await MinistryModel.bulkAssignPelayanan(no_jemaat, assign, updated_by);
    }

    if (remove && Array.isArray(remove)) {
      result.removed = await MinistryModel.bulkRemovePelayanan(no_jemaat, remove, updated_by);
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// --- Pelayanan -> Pelayan Endpoints ---

/**
 * Get all active pelayan for a specific pelayanan
 * GET /ministry/pelayanan/:pelayananId/pelayan
 */
router.get('/ministry/pelayanan/:pelayananId/pelayan', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pelayananId } = req.params;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await MinistryModel.getAllPelayanForPelayanan(pelayananId, page, limit);

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

export default router;
