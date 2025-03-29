import { IReport } from '@gofetch/models/IReport';
import { addReportCached, getCachedReports } from '@server/services/ReportCached';
import { cache } from '@server/utils/Cache';

export function getReportByID(reportId: number) {
    const report = cache.reports.find(report => report.id === reportId);
    if (report) {
        return { success: true, report };
    }
    return { success: false, message: 'Report not found' };
}

export function getAllReports() {
    const result = getCachedReports();
    if (result.length === 0) {
        return { success: false, message: 'No reports found' };
    }
    return { success: true, reports: result };
}

export function addReport(report: IReport) {
    return addReportCached(report);
}
