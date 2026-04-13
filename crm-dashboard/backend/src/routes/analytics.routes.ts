import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsModel } from '../models';

const router = Router();

/**
 * Get dashboard KPIs
 * GET /analytics/dashboard
 */
router.get('/analytics/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const kpis = await AnalyticsModel.getDashboardKPIs();

    res.json({
      success: true,
      data: kpis,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get member distribution
 * GET /analytics/members/distribution
 */
router.get('/analytics/members/distribution', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = (req.query.type as string) || 'gender';

    let data;
    switch (type) {
      case 'gender':
        data = await AnalyticsModel.getGenderDistribution();
        break;
      case 'age':
        data = await AnalyticsModel.getAgeDistribution();
        break;
      case 'domisili':
        data = await AnalyticsModel.getDomisiliDistribution();
        break;
      case 'kuliah_kerja':
        data = await AnalyticsModel.getKuliahKerjaRatio();
        break;
      default:
        data = await AnalyticsModel.getGenderDistribution();
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get member trends
 * GET /analytics/members/trends
 */
router.get('/analytics/members/trends', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = (req.query.start_date as string) || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = (req.query.end_date as string) || new Date().toISOString().split('T')[0];

    const trends = await AnalyticsModel.getAttendanceTrend(startDate, endDate);

    res.json({
      success: true,
      data: trends,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get attendance summary
 * GET /analytics/attendance/summary
 */
router.get('/analytics/attendance/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = (req.query.start_date as string) || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = (req.query.end_date as string) || new Date().toISOString().split('T')[0];

    const trends = await AnalyticsModel.getAttendanceTrend(startDate, endDate);

    const summary = trends.reduce(
      (acc, t) => {
        acc.total_records += t.total_expected;
        acc.total_present += t.total_present;
        return acc;
      },
      { total_records: 0, total_present: 0, hadir: 0, izin: 0, tidak_hadir: 0, tamu: 0, attendance_rate: 0 },
    );

    summary.hadir = summary.total_present;
    summary.total_records = summary.total_records;
    summary.attendance_rate = summary.total_records > 0
      ? Math.round((summary.total_present / summary.total_records) * 100 * 10) / 10
      : 0;

    res.json({
      success: true,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get attendance trends
 * GET /analytics/attendance/trends
 */
router.get('/analytics/attendance/trends', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startDate = (req.query.start_date as string) || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = (req.query.end_date as string) || new Date().toISOString().split('T')[0];

    const trends = await AnalyticsModel.getAttendanceTrend(startDate, endDate);

    res.json({
      success: true,
      data: trends,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get status distribution
 * GET /analytics/members/status/distribution
 */
router.get('/analytics/members/status/distribution', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const distribution = await AnalyticsModel.getStatusDistribution();

    res.json({
      success: true,
      data: distribution,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get CGF sizes
 * GET /analytics/cgf/sizes
 */
router.get('/analytics/cgf/sizes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cgfSizes = await AnalyticsModel.getCGFSizes();

    res.json({
      success: true,
      data: cgfSizes,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get CGF summary
 * GET /analytics/cgf/summary
 */
router.get('/analytics/cgf/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cgfSizes = await AnalyticsModel.getCGFSizes();
    const healthData = await AnalyticsModel.getCGHealthData();

    const totalGroups = cgfSizes.length;
    const totalMembersAssigned = cgfSizes.reduce((sum, g) => sum + g.member_count, 0);
    const averageGroupSize = totalGroups > 0 ? Math.round((totalMembersAssigned / totalGroups) * 10) / 10 : 0;

    const topAttendanceGroups = healthData
      .sort((a, b) => b.attendance_rate - a.attendance_rate)
      .slice(0, 5)
      .map((g) => ({
        cg_id: g.nama_cgf,
        nama_cgf: g.nama_cgf,
        attendance_rate: g.attendance_rate,
      }));

    res.json({
      success: true,
      data: {
        total_groups: totalGroups,
        total_members_assigned: totalMembersAssigned,
        average_group_size: averageGroupSize,
        groups_by_day: {},
        top_attendance_groups: topAttendanceGroups,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get ministry summary
 * GET /analytics/ministry/summary
 */
router.get('/analytics/ministry/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roleDistribution = await AnalyticsModel.getMinistryParticipation();
    const totalMinistryMembers = roleDistribution.reduce((sum, r) => sum + r.count, 0);
    const multiRoleMembers = roleDistribution.filter((r) => r.count > 1).length;

    res.json({
      success: true,
      data: {
        total_ministry_members: totalMinistryMembers,
        role_distribution: roleDistribution,
        multi_role_members: multiRoleMembers,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get events summary
 * GET /analytics/events/summary
 */
router.get('/analytics/events/summary', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const upcomingEvents = await AnalyticsModel.getUpcomingEvents(50);

    const eventsByCategory: Record<string, number> = {};
    upcomingEvents.forEach((e) => {
      eventsByCategory[e.category] = (eventsByCategory[e.category] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        total_events: upcomingEvents.length,
        events_by_category: eventsByCategory,
        total_participants: 0,
        average_participants_per_event: 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get event attendance trends
 * GET /analytics/events/attendance-trend
 */
router.get('/analytics/events/attendance-trend', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trends = await AnalyticsModel.getEventAttendanceTrends();

    res.json({
      success: true,
      data: trends,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get birthday members
 * GET /analytics/members/birthday
 */
router.get('/analytics/members/birthday', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const month = parseInt(req.query.month as string, 10) || new Date().getMonth() + 1;

    const birthdays = await AnalyticsModel.getBirthdayMembers(month);

    res.json({
      success: true,
      data: birthdays,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
