import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "@client/components/BackButton.module.css";

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