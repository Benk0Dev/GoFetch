import React, { useEffect, useState, useRef } from "react";
import { IReport } from "@gofetch/models/IReport";
import { addReport } from "@client/services/ReportRegistry";
import { Status, Result } from "@gofetch/models/IReport";

interface IReportSubmitProps {
    id: string;
    reporterId: number;
    reporteeId: number;
    title: string;
    description: string;
    status: Status;
    result?: Result;
    createdAt: Date;
    updatedAt: Date;
}

const ReportSubmit: React.FC<IReportSubmitProps> = ({
    id,
    reporterId,
    reporteeId,
    title,
    description,
    status,
    result,
    createdAt,
    updatedAt,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const hasSubmitted = useRef(false);

    useEffect(() => {
        if (hasSubmitted.current) return;
        hasSubmitted.current = true;

        const submitReport = async () => {
            try {
                setIsSubmitting(true);

                // check below report data
                const reportData: IReport = {
                    id,
                    reporterId,
                    reporteeId,
                    title,
                    description,
                    status,
                    result,
                    createdAt,
                    updatedAt,
                };
                const response = await addReport(reportData);

                if (response.success) {
                    setSuccessMessage("Thank you for your report.");
                  } else {
                    setError("An error occurred while sending your report.");
                  }
            } catch (error) {
                setError("An error occurred while sending your report.");
            } finally {
                setIsSubmitting(false);
            }
        }
        submitReport();
    }, [id, reporterId, reporteeId, title, description, status, result, createdAt, updatedAt])

    return (
        <div>
          {isSubmitting && <p>Submitting your report...</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      );
}

export default ReportSubmit;