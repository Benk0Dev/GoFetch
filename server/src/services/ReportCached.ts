import fs from 'fs';
import { IReport, Status } from '../models/IReport';
import { cache, DB_PATH } from './Cache';

export function getCachedReports(): IReport[] {
    try {
        return cache.reports;
    }
    catch (error) {
        return [];
    }
}

export function addReportCached(report: IReport) {
    try {
        const newId = cache.reports.length > 0 ? cache.reports[cache.reports.length - 1].id + 1 + 1 : 1;
        const newReport: IReport = {
            id: newId,
            reporterId: report.reporterId,
            reporteeId: report.reporteeId,
            title: report.title,
            description: report.description,
            status: Status.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        cache.reports.push(newReport);

        saveReportsToFile(cache.reports);

        return { success: true, message: 'Report added successfully!', report: newReport };
    } catch (error) {
        return { success: false, message: 'Failed to add report' };
    }
}

function saveReportsToFile(reports: IReport[]) {
    fs.writeFileSync(`${DB_PATH}/reports.json`, JSON.stringify(reports, null, 2), 'utf8');
}