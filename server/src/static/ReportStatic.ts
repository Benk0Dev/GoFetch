import { IReport, Result, Status } from '@gofetch/models/IReport';
import { addReportCached, getCachedReports } from '@server/services/ReportCached';
import { DB_PATH, cache } from '@server/services/Cache';
import fs from 'fs';

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

export function setReportInProgress(reportId: number) {
    const reportIndex = cache.reports.findIndex(report => report.id === reportId);
    if (reportIndex !== -1) {
        cache.reports[reportIndex].status = Status.IN_PROGRESS;
        cache.reports[reportIndex].updatedAt = new Date();
        try {
            fs.writeFileSync(`${DB_PATH}/reports.json`, JSON.stringify(cache.reports, null, 2), 'utf8');
            return { success: true, message: 'Report status was updated successfully' };
        } catch (error) {
            console.error('Error updating report status:', error);
            return { success: false, message: 'Error updating report status' };
        }
    }
    return { success: false, message: 'Report not found' };
}

export function setReportResult(reportId: number, result: Result) {
    const reportIndex = cache.reports.findIndex(report => report.id === reportId);
    if (reportIndex !== -1) {
        cache.reports[reportIndex].status = Status.RESOLVED;
        cache.reports[reportIndex].result = result;
        cache.reports[reportIndex].updatedAt = new Date();
        try {
            fs.writeFileSync(`${DB_PATH}/reports.json`, JSON.stringify(cache.reports, null, 2), 'utf8');
            return { success: true, message: 'Report result was updated successfully' };
        } catch (error) {
            console.error('Error updating report result:', error);
            return { success: false, message: 'Error updating report result' };
        }
    }
    return { success: false, message: 'Report not found' };
}