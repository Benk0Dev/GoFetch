import { useState } from "react";
import styles from "./Profile.module.css";

function Profile() {
    const [bio, setBio] = useState("Loving pet minder with 5 years of experience!");
    const [availability, setAvailability] = useState("Weekdays & Weekends");

    return (
        <div className={styles.profile}>
            <h2>Edit Public Profile</h2>
            <label>Bio:</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            
            <label>Availability:</label>
            <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} />

            <button>Save Changes</button>
        </div>
    );
}

export default Profile;
