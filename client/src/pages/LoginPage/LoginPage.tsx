import LoginForm from "./LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { getUserRole } from "../../utils/StorageManager";
import { Role } from "../../models/IUser";

function LoginPage() {
    const navigate = useNavigate();
    
        useEffect(() => {
            const currentUserType = getUserRole();
            if (currentUserType) {
                if (currentUserType === Role.MINDER) {
                    navigate("/dashboard");
                } else {
                    navigate("/browse");
                }
            }
        }, []);

    return (
        // <div className={styles.loginContainer}>
        <div className="container flex-center">
        <div className={styles.loginBox}>
            <h2>Login</h2>
            <LoginForm />
            <p>
            Don't have an account? <a href="/register" className={styles.registerLink}>Sign Up</a>
            </p>
        </div>
        </div>
        // </div>
    );
}

export default LoginPage;
