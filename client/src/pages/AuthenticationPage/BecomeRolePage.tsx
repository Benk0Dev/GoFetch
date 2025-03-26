import { useNavigate } from "react-router-dom";
import styles from "./AuthenticationPage.module.css";
import { Role } from "../../models/IUser";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../../components/BackButton";
import { UserRound, Check } from "lucide-react";

function BecomeRolePage({ role }: { role: Role }) {
    const { switchRole } = useAuth();
    const navigate = useNavigate();

    const handleConfirm = () => {
        switchRole();
        navigate("/dashboard");
    };

  return (
    <div className={`container ${styles.becomeRole}`}>
        <div className={styles.becomeRoleContainer}>
            <BackButton />
            <div className={styles.becomeRoleContent}>
                <div className={styles.icon}>
                    <UserRound size={48} strokeWidth={2} />
                </div>
                <h2>{role === Role.MINDER ? "Become a Pet Minder" : "Become a Pet Owner"}</h2>
                <p>
                    By confirming, you'll be able to {role === Role.MINDER ? "set up your public profile, add services and receive booking requests" : "add pets and book services"}.
                </p>
                <button className="btn2 btn-primary" onClick={handleConfirm}>
                    <Check size={18} strokeWidth={2} />Confirm
                </button>
            </div>
        </div>
    </div>
  );
}

export default BecomeRolePage;
