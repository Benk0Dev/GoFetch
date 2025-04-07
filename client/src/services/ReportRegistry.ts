import {IReport} from "@gofetch/models/IReport"

import { API_URL } from "@client/services/Registry";

export const addReport = async (reportData: IReport) => {
    try {
        const response = await fetch (`${API_URL}/report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reportData)
        });
        if (response.ok) {
            const report = await response.json();

            // get user or something?

            return report;
        } else {
            const text = await response.text();
            console.error(text);
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
      }
};

export const setReportResult = async (reportId: number, result: string) => {
    try {
        const response = await fetch(`${API_URL}/report/${reportId}/result`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ result })
        });
        if (!response.ok) throw new Error("Failed to update report result");
        return await response.text();
    } catch (error) {
        console.error(error);
        return null;
    }
};  

export const getAllReports = async () => {
    try {
        const response = await fetch(`${API_URL}/reports`);
        if (!response.ok) throw new Error("Failed to fetch reports");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};