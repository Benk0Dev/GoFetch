import { useNavigate } from "react-router-dom";
import LoginForm from "@client/pages/AuthenticationPage/LoginForm";
import styles from "@client/pages/AuthenticationPage/AuthenticationPage.module.css";
import BackButton from "@client/components/BackButton";

function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className={`container ${styles.authentication}`}>
            <div className={styles.authenticationContainer}>
                <BackButton />
                <div className={styles.authenticationBox}>
                    <h2>Login</h2>
                    <LoginForm />
                    <p>Don't have an account? <button onClick={() => navigate("/register")} className={styles.alternateLink}>Sign Up</button></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
