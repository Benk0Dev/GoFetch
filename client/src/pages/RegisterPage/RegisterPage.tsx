import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/AuthService";
import styles from "./RegisterPage.module.css";

function RegisterPage() {
    function RegisterForm() {
        const [name, setName] = useState("");
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [userType, setCurrentUserType] = useState("");
        const [error, setError] = useState("");
        const navigate = useNavigate();
    
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError("");
            console.log("Registering with:", { name, email, password });

            const newUser = await register(name, email, password);

            if (newUser) {
                console.log("Registration successful:", newUser);
                navigate("/dashboard");
            } else {
                setError("Registration failed. Try again.");
            }
        }
    
        return (
            <form className={styles.registerForm} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label>User Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        placeholder="User Name"
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                </div>

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

                <div className={styles.inputGroup}>
                    <label>Account Type</label>

                    <div className={styles.radioGroup}>
                        <label>
                            <input type="radio" name="userType" value="owner"
                                checked={userType === "owner"}
                                onChange={(e) => setCurrentUserType(e.target.value)}
                                required
                            />
                            Owner
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="minder"
                                checked={userType === "minder"}
                                onChange={(e) => setCurrentUserType(e.target.value)}
                                required
                            />
                            Minder
                        </label>
                    </div>
                </div>

                <div className={styles.errorContainer}>
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <button type="submit" className={styles.registerButton} style={{width: "100%"}}>Register</button>
            </form>
        );
    }

    return <RegisterForm />;
}

export default RegisterPage;