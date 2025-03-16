import LoginForm from "./LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { getCurrentUserType } from "../../services/AuthService";
import { Role } from "../../models/User";

function LoginPage() {
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
        }, []);

    const navBarHeight: number = document.getElementById('navbar')?.offsetHeight || 0;

    return (
        <div className="container flex-center" style={{ height: `calc(100vh - ${navBarHeight}px)` }}>
        <div className={styles.loginBox}>
            <h2>Login</h2>
            <LoginForm />
            <p>
            Don't have an account? <a href="/register" className={styles.registerLink}>Sign Up</a>
            </p>
        </div>
        </div>
    );
}

export default LoginPage;
