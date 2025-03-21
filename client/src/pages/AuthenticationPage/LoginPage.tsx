import LoginForm from "./LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthenticationPage.module.css";
import "../../global.css";
import { getUserRole } from "../../utils/StorageManager";

function LoginPage() {
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
                <h2>Login</h2>
                <LoginForm />
                <p>Don't have an account? <button onClick={() => navigate("/register")} className={styles.alternateLink}>Sign Up</button></p>
            </div>
        </div>
    );
}

export default LoginPage;
