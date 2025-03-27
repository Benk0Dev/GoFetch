import { useNavigate } from "react-router-dom";
import styles from "@client/pages/AuthenticationPage/AuthenticationPage.module.css";
import "@client/global.css"
import RegisterForm from "@client/pages/AuthenticationPage/RegisterForm";
import BackButton from "@client/components/BackButton";

function RegisterPage() {
    const navigate = useNavigate();

    return (
        <div className={`container ${styles.authentication}`}>
            <div className={styles.authenticationContainer}>
                <BackButton />
                <div className={styles.authenticationBox}>
                    <h2>Create an Account</h2>
                    <RegisterForm />
                    <p>Already have an account? <button onClick={() => navigate("/login")} className={styles.alternateLink}>Login</button></p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
