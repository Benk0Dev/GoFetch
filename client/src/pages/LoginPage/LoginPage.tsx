import LoginForm from "./LoginForm";
import styles from "./LoginPage.module.css";

function LoginPage() {
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
