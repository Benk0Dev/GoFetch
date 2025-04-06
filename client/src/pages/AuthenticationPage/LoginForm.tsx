import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@client/context/AuthContext";
import styles from "@client/pages/AuthenticationPage/AuthenticationPage.module.css";
import { login } from "@client/services/UserRegistry";

function LoginForm() {
    const { loginUser } = useAuth();

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
            loginUser(user.id);
            navigate("/dashboard", { replace: true });
        } else {
            setError("Invalid Email or Password.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.input}>
                <label>Email</label>
                <input 
                    type="email" 
                    value={email} 
                    placeholder="john.doe@example.com"
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
            </div>

            <div className={styles.input}>
                <label>Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
            </div>

            <p className={styles.error}>{error}</p>

            <button type="submit" className="btn btn-primary" style={{width: "100%"}}>Login</button>
        </form>
    );
}

export default LoginForm;
