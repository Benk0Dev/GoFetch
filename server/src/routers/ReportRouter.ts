import { Router, Request, Response } from 'express';
import { addReport, getAllReports, getReportByID, setReportInProgress, setReportResult } from '@server/static/ReportStatic';

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

// Set report in progress
router.put('/report/:reportId/in-progress', (req: Request, res: Response) => {
    const result = setReportInProgress(parseInt(req.params.reportId));
    res.status(result.success ? 200 : 404).send(result.message);
});

// Set report result
router.put('/report/:reportId/result', (req: Request, res: Response) => {
    const result = setReportResult(parseInt(req.params.reportId), req.body.result);
    res.status(result.success ? 200 : 404).send(result.message);
});

export default router;
