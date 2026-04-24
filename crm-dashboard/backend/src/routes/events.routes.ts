import { Router, Request, Response, NextFunction } from 'express';
import { validate } from './validators';
import * as schemas from './validators';
import { EventsModel } from '../models';

const router = Router();

/**
 * Get all events
 * GET /events
 */
router.get('/events', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;

    const filters: Record<string, unknown> = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.start_date) filters.start_date = req.query.start_date;
    if (req.query.end_date) filters.end_date = req.query.end_date;

    const result = await EventsModel.getAll(page, limit, filters);

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
 * Create a new event
 * POST /events
 */
router.post('/events', validate(schemas.EventCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await EventsModel.create(req.body);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get event by ID
 * GET /events/:eventId
 */
router.get('/events/:eventId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const event = await EventsModel.getById(eventId);

    if (!event) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Event not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update event
 * PUT /events/:eventId
 */
router.put('/events/:eventId', validate(schemas.EventUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const event = await EventsModel.update(eventId, req.body);

    if (!event) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Event not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Delete event
 * DELETE /events/:eventId
 */
router.delete('/events/:eventId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const deleted = await EventsModel.delete(eventId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Event not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * Get event participants
 * GET /events/:eventId/participants
 */
router.get('/events/:eventId/participants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const participants = await EventsModel.getParticipants(eventId);

    res.json({
      success: true,
      data: participants,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Add participant to event
 * POST /events/:eventId/participants
 */
router.post('/events/:eventId/participants', validate(schemas.EventParticipationCreateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const data = { ...req.body, event_id: eventId };
    const participant = await EventsModel.addParticipant(data);

    res.status(201).json({
      success: true,
      data: participant,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Add participants in bulk to event
 * POST /events/:eventId/participants/bulk
 */
router.post('/events/:eventId/participants/bulk', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const { participants } = req.body;

    if (!Array.isArray(participants) || participants.length === 0) {
      res.status(400).json({
        success: false,
        error: { code: 400, message: 'participants must be a non-empty array' },
      });
      return;
    }

    const result = await EventsModel.addParticipantsBulk(eventId, participants);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Update participant record
 * PUT /events/:eventId/participants/:id
 */
router.put('/events/:eventId/participants/:id', validate(schemas.EventParticipationUpdateSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const participant = await EventsModel.updateParticipant(id, req.body);

    if (!participant) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Participant not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: participant,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Remove participant from event
 * DELETE /events/:eventId/participants/:id
 */
router.delete('/events/:eventId/participants/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await EventsModel.removeParticipant(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: { code: 404, message: 'Participant not found' },
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * Get participant analytics for an event
 * GET /events/:eventId/participants/analytics
 */
router.get('/events/:eventId/participants/analytics', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const analytics = await EventsModel.getParticipantAnalytics(eventId);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get events for a member
 * GET /members/:no_jemaat/events
 */
router.get('/members/:no_jemaat/events', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const no_jemaat = parseInt(req.params.no_jemaat, 10);
    const events = await EventsModel.getMemberEvents(no_jemaat);

    res.json({
      success: true,
      data: events,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
