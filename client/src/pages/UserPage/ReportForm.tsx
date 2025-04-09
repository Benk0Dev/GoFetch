import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "@client/pages/UserPage/ReportPage.module.css"
import "@client/global.css";
import { useAuth } from "@client/context/AuthContext";
import { IReport, Status } from "@gofetch/models/IReport";
import { addReport } from "@client/services/ReportRegistry";

function ReportForm () {
    const {user} = useAuth();
    const [title, setTitle] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const location = useLocation();
    const { reporteeId } = location.state || {};
    const navigate = useNavigate();
    const wordLimit = 250;

    useEffect(() => {
        if (!location.state?.reporteeId) {
            navigate("/dashboard", { 
                state: { 
                    error: "Please initiate reports from a user's profile" 
                },
                replace: true 
            });
        }
    }, [location, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (title.length === 0 || reason.length === 0) {
            setError("Please fill in all fields.");
            return;
        }

        const wordCount = reason.trim() === "" ? 0 : reason.trim().split(/\s+/).length;
        if (wordCount > wordLimit) {
            setError(`You have exceeded the maximum ${wordLimit} words.`);
            return;
        }

        const reportData: IReport = {
            id: 0, // This will be set by the server
            reporterId: user.id,
            reporteeId: reporteeId,
            title,
            description: reason,
            status: Status.PENDING,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const newReport = await addReport(reportData);

        if (newReport) {
            alert("Thank you for your report.");
            navigate(-1);
        } else {
            setError("An error occurred while sending your report. Please try again.");
            return;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.input}>
                <label>Report Title</label>
                <input 
                    type="title" 
                    value={title} 
                    placeholder="Enter a title or subject for your report"
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
            </div>

            <div className={styles.input}>
                <label>Reason</label>
                <textarea 
                    value={reason} 
                    placeholder={`Up to ${wordLimit} words`}
                    onChange={(e) => setReason(e.target.value)} 
                    required
                    className={styles.reasonTextarea}
                />
                {error && <div className={styles.error}>{error}</div>}
            </div>

            <button 
                onClick={handleSubmit}
                type="submit"
                className="btn btn-primary"
                style={{width: "100%"}}
            >
                Submit Report
            </button>
        </form>
    );

}

export default ReportForm;