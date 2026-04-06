import { Router, Request, Response, NextFunction } from 'express';
import { validate } from './validators';
import * as schemas from './validators';
import { CGFModel } from '../models';

const router = Router();

/**
 * Get all CGF groups
 * GET /groups
 */
router.get('/groups', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const result = await CGFModel.getAllGroups(page, limit);

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
 * Create a new CGF group
 * POST /groups
 */
router.post('/groups', validate(schemas.CGFCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await CGFModel.createGroup(req.body);

    res.status(201).json({
      success: true,
      data: group,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get CGF group by ID
 * GET /groups/:cgId
 */
router.get('/groups/:cgId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cgId } = req.params;
    const group = await CGFModel.getGroupById(cgId);

    if (!group) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'CGF group not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: group,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update CGF group
 * PUT /groups/:cgId
 */
router.put('/groups/:cgId', validate(schemas.CGFUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cgId } = req.params;
    const group = await CGFModel.updateGroup(cgId, req.body);

    if (!group) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'CGF group not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: group,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Delete CGF group
 * DELETE /groups/:cgId
 */
router.delete('/groups/:cgId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cgId } = req.params;
    const deleted = await CGFModel.deleteGroup(cgId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'CGF group not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * Get members of a CGF group
 * GET /groups/:cgId/members
 */
router.get('/groups/:cgId/members', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cgId } = req.params;
    const members = await CGFModel.getMembersByGroup(cgId);

    res.json({
      success: true,
      data: members,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Add member to CGF group
 * POST /groups/:cgId/members
 */
router.post('/groups/:cgId/members', validate(schemas.CGFMemberCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cgId } = req.params;
    const data = { ...req.body, nama_cgf: cgId };
    const member = await CGFModel.addMemberToGroup(data);

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update member assignment in CGF group
 * PUT /groups/:cgId/members/:noJemaat
 */
router.put('/groups/:cgId/members/:noJemaat', validate(schemas.CGFMemberUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noJemaat = parseInt(req.params.noJemaat, 10);
    const member = await CGFModel.updateMemberAssignment(noJemaat, req.body);

    if (!member) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'CGF member assignment not found' },
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
 * Remove member from CGF group
 * DELETE /groups/:cgId/members/:noJemaat
 */
router.delete('/groups/:cgId/members/:noJemaat', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cgId } = req.params;
    const noJemaat = parseInt(req.params.noJemaat, 10);
    const deleted = await CGFModel.removeMemberFromGroup(noJemaat, cgId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'CGF member assignment not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
