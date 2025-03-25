import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import styles from "./AuthenticationPage.module.css";
import "../../global.css";
import BackButton from "../../components/BackButton";

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
