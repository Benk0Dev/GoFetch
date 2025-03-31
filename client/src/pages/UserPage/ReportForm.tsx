import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "@client/pages/UserPage/Reporting.module.css"
import "@client/global.css";

function ReportForm () {
    const [title, setTile] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const wordLimit = 250;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const wordCount = reason.trim() === "" ? 0 : reason.trim().split(/\s+/).length;
        if (wordCount > wordLimit) {
            setError(`You have exceeded the maximum ${wordLimit} words`);
            return;
        }

        setError("");

        // implement handling
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
                    onChange={(e) => setTile(e.target.value)} 
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

            <button type="submit" className="btn btn-primary" style={{width: "100%"}}>Submit Report</button>
        </form>
    );

}

export default ReportForm;