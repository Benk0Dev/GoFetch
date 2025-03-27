import { ArrowLeft } from "lucide-react";
import styles from "./BackButton.module.css";
import { useNavigate } from "react-router-dom";

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