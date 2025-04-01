import {IReport} from "@gofetch/models/IReport"

import { API_URL } from "@client/services/Registry";

// remember to set basic report data with the form

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