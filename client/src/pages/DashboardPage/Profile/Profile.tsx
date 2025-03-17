import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import dashboardStyles from "../DashboardPage.module.css";
import { getCurrentUser } from "../../../services/AuthService";
import ImageViewer from "./ImageViewer";
import { Admin, PetOwner } from "../../../models/User";
import getFullFilePath from "../../../utils/FullFilePath";
import "react-range-slider-input/dist/style.css";

function Profile() {
    const user = getCurrentUser();
    
    if (user?.userClass instanceof Admin) return null;
    if (user?.userClass.role.currentRole instanceof PetOwner) return null;

    const [bio, setBio] = useState(user?.userClass.role.currentRole.bio || "");
    const [availability, setAvailability] = useState(user?.userClass.role.currentRole.availability || "");
    const [distanceRange, setDistanceRange] = useState(user?.userClass.role.currentRole.distanceRange || 10);
    const [pictures, setPictures] = useState<string[]>(user?.userClass.role.currentRole.pictures.map(pic => getFullFilePath(pic)) || []);
    const [originalState, setOriginalState] = useState({ bio, availability, distanceRange, pictures });
    const [showImageViewer, setShowImageViewer] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Check for unsaved changes
    useEffect(() => {
        setHasUnsavedChanges(
            bio !== originalState.bio ||
            availability !== originalState.availability ||
            distanceRange !== originalState.distanceRange ||
            pictures.join() !== originalState.pictures.join()
        );
    }, [bio, availability, distanceRange, pictures]);

    // Warn before navigating away
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = ""; // Required for Chrome
            }
        };
        
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Add new picture
    const handleAddPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newPicture = URL.createObjectURL(e.target.files[0]);
            setPictures([...pictures, newPicture]);
        }
    };

    // Remove picture
    const handleRemovePicture = (index: number) => {
        setPictures(pictures.filter((_, i) => i !== index));
    };

    // Cancel changes
    const handleCancel = () => {
        if (confirm("Are you sure you want to cancel? Your changes will be lost.")) {
            setBio(originalState.bio);
            setAvailability(originalState.availability);
            setDistanceRange(originalState.distanceRange);
            setPictures(originalState.pictures);
            setHasUnsavedChanges(false);
        }
    };

    // Confirm & save changes
    const handleSave = () => {
        setOriginalState({ bio, availability, distanceRange, pictures });
        setHasUnsavedChanges(false);
    };

    return (
        <div className={`${dashboardStyles.dashboardSection} ${styles.profile}`}>
            <h2>Edit Public Profile</h2>

            <label>About Me</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

            <label>Availability</label>
            <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} />

            <label>Travel Distance Range</label>
            <div className={styles["slider-container"]}>
                <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    step="0.5"
                    value={distanceRange} 
                    onChange={(e) => setDistanceRange(Number(e.target.value))} 
                />
                <span className={styles["slider-value"]}>{distanceRange} mi</span>
            </div>

            <label>Photos</label>
            <div className={styles.photoGrid}>
                {pictures.map((pic, index) => (
                    <div key={index} className={styles.photoItem}>
                        <img src={pic} alt="Profile" onClick={() => setShowImageViewer(pic)} />
                        <button className={styles.removeBtn} onClick={() => handleRemovePicture(index)}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                ))}
                <label className={styles.addImage}>
                    <i className="fa-solid fa-plus"></i>
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={handleAddPicture} />
                </label>
            </div>

            <div className={styles.buttonGroup}>
                <button className={`btn btn-secondary`} onClick={handleCancel}>Cancel</button>
                <button className={`btn btn-primary`} onClick={handleSave}>Confirm</button>
            </div>

            {showImageViewer && <ImageViewer imageSrc={showImageViewer} onClose={() => setShowImageViewer(null)} />}
        </div>
    );
}

export default Profile;
