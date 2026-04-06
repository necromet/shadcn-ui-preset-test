import { Router } from 'express';

import membersRoutes from './members.routes';
import attendanceRoutes from './attendance.routes';
import cgfRoutes from './cgf.routes';
import eventsRoutes from './events.routes';
import ministryRoutes from './ministry.routes';
import statusRoutes from './status.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

router.use(membersRoutes);
router.use(attendanceRoutes);
router.use(cgfRoutes);
router.use(eventsRoutes);
router.use(ministryRoutes);
router.use(statusRoutes);
router.use(analyticsRoutes);

export default router;
