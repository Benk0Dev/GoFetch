import { Router, Request, Response } from 'express';
import { addReport, getAllReports, getReportByID } from '@server/static/ReportStatic';

const router = Router();

// Add a report
router.post('/report', (req: Request, res: Response) => {
    const result = addReport(req.body);
    res.status(result.success ? 201 : 400).send(result.report);
});

// Get all reports
router.get('/reports', (req: Request, res: Response) => {
    const result = getAllReports();
    res.status(result.success ? 200 : 404).send(result.reports);
});

// Get report by ID
router.get('/report/:reportId', (req: Request, res: Response) => {
    const result = getReportByID(parseInt(req.params.reportId));
    res.status(result.success ? 200 : 404).send(result.report);
});

export default router;
