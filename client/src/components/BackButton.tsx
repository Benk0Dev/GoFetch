import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.css";
import { useNavigate } from "react-router-dom";

function BackButton({ text="Back" }: { text?: string }) {
    const navigate = useNavigate();

    return (
        <button className={`btn-link ${styles.backButton}`} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>{text}</span>
        </button>
    );
}

export default BackButton;