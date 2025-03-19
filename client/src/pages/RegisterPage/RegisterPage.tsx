
function RegisterPage() {
    return (
        <form className={styles.registerForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label>First Name</label>
                <input 
                    type="text" 
                    value={Name} 
                    placeholder="First Name"
                    onChange={(e) => setName(e.target.value)}
                    required 
                />
            </div>

            <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input 
                    type="text" 
                    value={Last Name} 
                    placeholder="Last Name"
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

            <div className={styles.errorContainer}>
                {error && <p className={styles.error}>{error}</p>}
            </div>


            <button type="submit" className={styles.loginButton} style={{width: "100%"}}>Login</button>
        </form>
    );
}

export default RegisterPage;