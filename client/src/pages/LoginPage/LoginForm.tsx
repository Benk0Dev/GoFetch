import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { login } from "../../services/AuthService";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Logging in with:", { email, password });

        const user = await login(email, password);
        if (user) {
            console.log("Login successful:", user);
            navigate("/dashboard");
        } else {
            setError("Invalid email or password");
        }
    };

    return (
        <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label>Email</label>
                <input 
                    type="email" 
                    value={email} 
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>

            <div className={styles.inputGroup}>
                <label>Password</label>
                <input 
                    type="password" 
                    value={password} 
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
            </div>

            {error && <p className={styles.error}>{error}</p>} {}

            <button type="submit" className={styles.loginButton} style={{width: "100%"}}>Login</button>
        </form>
    );
}

export default LoginForm;
