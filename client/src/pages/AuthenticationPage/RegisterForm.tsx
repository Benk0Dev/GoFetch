import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AuthenticationPage.module.css";
import { registerUser, verifyUniqueEmailAndUsername } from "../../services/Registry";
import { IRegisterUser, Role } from "../../models/IUser";

function RegisterForm() {
    const navigate = useNavigate();

    const [fname, setFname] = useState("");
    const [sname, setSname] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [dob, setDob] = useState("");
    const [role, setRole] = useState(Role.OWNER);

    const [fnameError, setFnameError] = useState("");
    const [snameError, setSnameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [password2Error, setPassword2Error] = useState("");
    const [dobError, setDobError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFnameError("");
        setSnameError("");
        setEmailError("");
        setUsernameError("");
        setPasswordError("");
        setPassword2Error("");
        setDobError("");

        let error = false;

        const nameRegex = /^[A-Za-z]+$/;

        if (!nameRegex.test(fname)) {
            setFnameError("First name should contain only letters.");
            error = true;
        }

        if (!nameRegex.test(sname)) {
            setSnameError("Last name should contain only letters.");
            error = true;
        }

        if (username.length < 4 || username.length > 20) {
            setUsernameError("Username should be between 4 and 20 characters.");
            error = true;
        }

        if (password.length < 8) {
            setPasswordError("Password should be atleast 8 characters long.");
            error = true;
        }

        if (password !== password2) {
            setPassword2Error("Passwords do not match.");
            error = true;
        }

        const dobDate = new Date(dob);
        const currentDate = new Date();

        let age = currentDate.getFullYear() - dobDate.getFullYear();

        const hasBirthdayPassed = currentDate.getMonth() > dobDate.getMonth() || (currentDate.getMonth() === dobDate.getMonth() && currentDate.getDate() >= dobDate.getDate());

        if (!hasBirthdayPassed) {
            age -= 1;
        }

        if (age < 16) {
            setDobError("You do not meet the minimum age requirement to use GoFetch.");
            error = true;
        }

        const notUnique = await verifyUniqueEmailAndUsername(email, username);

        if (notUnique) {
            if (notUnique.email) {
                setEmailError("Email is already in use.");
                error = true;
            }

            if (notUnique.username) {
                setUsernameError("Username is already in use.");
                error = true;
            }
        }

        if (error) {
            return;
        }

        const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        const userDetails: IRegisterUser = {
            fname: capitalize(fname),
            sname: capitalize(sname),
            email,
            username,
            password,
            dob: new Date(dob),
            role: role === Role.OWNER ? Role.OWNER : Role.MINDER,
        }

        const newUser = await registerUser(userDetails);

        if (newUser) {
            console.log("Registration successful:", newUser);
            navigate("/dashboard"); 
        } else {
            console.log("Registration failed");
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.doubleRow}>
                <div className={styles.input}>
                    <label>First Name</label>
                    <input
                        type="text"
                        value={fname}
                        placeholder="John"
                        onChange={(e) => setFname(e.target.value)}
                        required
                    />
                    <p className={styles.error}>{fnameError}</p>
                </div>
                <div className={styles.input}>
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={sname}
                        placeholder="Doe"
                        onChange={(e) => setSname(e.target.value)}
                        required
                    />
                    <p className={styles.error}>{snameError}</p>
                </div>
            </div>
            <div className={styles.input}>
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    placeholder="johndoe"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <p>This will be your unique identifier on GoFetch.</p>
                <p className={styles.error}>{usernameError}</p>
            </div>
            <div className={styles.input}>
                <label>Date of Birth</label>
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                />
                <p>You must be atleast 16 years old to use GoFetch.</p>
                <p className={styles.error}>{dobError}</p>
            </div>
            <div className={styles.input}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    placeholder="john.doe@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <p className={styles.error}>{emailError}</p>
            </div>
            <div className={styles.input}>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <p className={styles.error}>{passwordError}</p>
            </div>
            <div className={styles.input}>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                    <p className={styles.error}>{password2Error}</p>
            </div>
            <div className={styles.input}>
                <label>Account Type</label>
                <div className={styles.radioGroup}>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value={Role.OWNER}
                            checked={role === Role.OWNER}
                            onChange={() => setRole(Role.OWNER)}
                            required
                        />
                        <span>Pet Owner</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value={Role.MINDER}
                            checked={role === Role.MINDER}
                            onChange={() => setRole(Role.MINDER)}
                            required
                        />
                        <span>Pet Minder</span>
                    </label>
                </div>
                <p>Select whether you want to find pet minders or offer pet minding services.</p>
            </div>
            <button type="submit" className="btn2 btn-primary" style={{width: "100%"}}>Create Account</button>
        </form>
    );
}

export default RegisterForm;
