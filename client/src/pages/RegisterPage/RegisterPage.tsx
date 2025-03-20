import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import RegisterForm from "./RegisterForm";
import { getCurrentUserType } from "../../services/AuthService";
import { Role } from "../../models/User";

function RegisterPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const currentUserType = getCurrentUserType();

        if (currentUserType) {
            if (currentUserType === Role.MINDER) {
                navigate("/dashboard");
            } else {
                navigate("/browse");
            }
        }
    }, [navigate]);

    return (
        <div className={"container flex-center"}>
            <div className={styles.registerBox}>
                <h2>Register for an account</h2>
                <RegisterForm />
                <p>
                    Have an account? <a href="/login" className={styles.registerLink}>Log In</a>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
