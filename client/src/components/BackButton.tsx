import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "@client/components/BackButton.module.css";

function BackButton() {
    const navigate = useNavigate();

    return (
        <button className={`btn-link ${styles.backButton}`} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Back</span>
        </button>
    );
}

export default BackButton;