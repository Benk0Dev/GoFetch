import { useState } from "react";
import { useNavigate } from "react-router-dom";
import registry from "../../services/Registry";

import styles from "./RegisterPage.module.css";
// import Dashboard from "../DashboardPage/DashboardPage";

function RegisterPage() {
    const navigate = useNavigate(); 

    function RegisterForm() {
        const [lastName, setLastName] = useState("");
        const [firstName, setFirstName] = useState("");
        const [userName, setUserName] = useState("");
        const [email, setEmail] = useState("");
        const [password1, setPassword1] = useState("");
        const [password2, setPassword2] = useState("");
        const [dob, setDob] = useState("");
        const [currentUserType, setCurrentUserType] = useState("");
        const [error, setError] = useState("");

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setError("");
            console.log("Registering with:", { userName, firstName, lastName, email, password1, dob, currentUserType });

            if (password1 !== password2) {
                setError("Passwords do not match");
                return;
            }

            try {
                const newUser = await registry.register(userName, firstName, lastName, email, password1, dob, currentUserType);

                if (newUser) {
                    console.log("Registration successful:", newUser);
                    navigate("/dashboard"); 
                } else {
                    setError("Registration failed. Try again.");
                }
            } catch (err) {
                setError("An error occurred. Please try again.");
                console.error("Registration error:", err);
            }
        };

        return (
            <form className={styles.registerForm} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label>Username</label>
                    <input
                        type="text"
                        value={userName}
                        placeholder="Username"
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Date of Birth</label>
                    <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
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
                    <div className="password1">
                    <label>Password</label>
                        <input
                            type="password"
                            value={password1}
                            placeholder="Password"
                            onChange={(e) => setPassword1(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <div className="password2"></div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={password2}
                            placeholder="Confirm Password"
                            onChange={(e) => setPassword2(e.target.value)}
                            required
                        />
                </div>

                <div className={styles.inputGroup}>
                    <h3>Account Type</h3>
                    <div className={styles.radioGroup}>
                        <label className = {styles.radioLabel}>
                            <label> Pet Owner</label>
                                <input
                                    type="radio"
                                    name="userType" 
                                    value="pet owner"
                                    // checked={currentUserType === "owner"}
                                    onChange={(e) => setCurrentUserType(e.target.value)}
                                    required
                                />
                        </label>
                        <label className = {styles.radioLabel}>
                            <label> Pet Minder</label>
                                <input
                                    type="radio"
                                    name="userType"
                                    value="pet minder"
                                    // checked={currentUserType === "minder"}
                                    onChange={(e) => setCurrentUserType(e.target.value)}
                                    required
                                />
                        </label>
                    </div>
                </div>

                <div className={styles.errorContainer}>
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <button type="submit" className={styles.registerButton} style={{ width: "100%" }}>
                    Register
                </button>
            </form>
        );
    }

    return <RegisterForm />;
}

export default RegisterPage;
