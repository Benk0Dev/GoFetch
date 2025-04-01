import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "@client/pages/UserPage/Reporting.module.css"
import "@client/global.css";
import ReportSubmit from "./ReportSubmit";
import { useAuth } from "@client/context/AuthContext";
import { Status } from "@gofetch/models/IReport";
import { v4 as uuidv4 } from 'uuid';

function ReportForm () {
    const {user} = useAuth();
    const [title, setTitle] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const location = useLocation();
    const { reporteeId } = location.state || {};

    const [isProcessing, setIsProcessing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
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

        const wordCount = reason.trim() === "" ? 0 : reason.trim().split(/\s+/).length;
        if (wordCount > wordLimit) {
            setError(`You have exceeded the maximum ${wordLimit} words`);
            return;
        }

        setError("");

        setTimeout(() => {
            setIsSubmitted(true);
            setTimeout(() => {
                navigate("/dashboard");
            });
            setIsProcessing(false);
        }, 2000);

    };

    // character limit for reason
    // error handling?

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.input}>
                <label>Report Title</label>
                <input 
                    type="title" 
                    value={title} 
                    placeholder="Enter a title/subject for your report"
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
                    rows={5} 
                    className={styles.reasonTextarea}
                />
                {error && <div className={styles.error}>{error}</div>}
            </div>

            <button 
                onClick={handleSubmit}
                disabled={isProcessing}
                type="submit"
                className="btn btn-primary"
                style={{width: "100%"}}
            >
                {isProcessing ? "Processing ..." : "Submit Report"}
            </button>
            {isSubmitted && (
                <ReportSubmit
                    id={uuidv4()}
                    reporterId={user.id}
                    reporteeId={reporteeId}
                    title={title}
                    description={reason}
                    status={Status.PENDING}
                    result={undefined}
                    createdAt={new Date()}
                    updatedAt={new Date()}
                />
            )}
        </form>
    );

}

export default ReportForm;