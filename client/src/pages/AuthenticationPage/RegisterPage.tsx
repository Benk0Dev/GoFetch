import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthenticationPage.module.css";
import "../../global.css";
import RegisterForm from "./RegisterForm";
import { getUserRole } from "../../utils/StorageManager";

function RegisterPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const currentUserType = getUserRole();
        if (currentUserType) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <div className={styles.authenticationContainer}>
            <div className={styles.authenticationBox}>
                <h2>Create an Account</h2>
                <RegisterForm />
                <p>Already have an account? <button onClick={() => navigate("/login")} className={styles.alternateLink}>Login</button></p>
            </div>
        </div>
    );
}

export default RegisterPage;
