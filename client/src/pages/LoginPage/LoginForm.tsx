import { useState } from "react";
import styles from "./LoginPage.module.css";
import { useEffect } from 'react';

async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3001/users');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const users = await response.json();
        return users;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return [];
    }
}

async function validateLogin(email: string, password: string): Promise<boolean> {
    const users = await fetchUsers();
    return users.some((user: { email: string; password: string }) => user.email === email && user.password === password);
}

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // to test the fetchUsers function
    useEffect(() => {
        fetchUsers().then(users => {
            console.log(users);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Logging in with:", { email, password });

        const result = await validateLogin(email, password);
        if (result) {
            console.log("Login successful");
        } else {
            console.log("Login failed");
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

            <button type="submit" className={styles.loginButton} style={{width: "100%"}}>Login</button>

        </form>
    );
}

export default LoginForm;
