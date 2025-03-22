import { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import dashboardStyles from "../DashboardPage.module.css";
import ImageViewer from "./ImageViewer";
import getFullFilePath from "../../../utils/FullFilePath";
import "react-range-slider-input/dist/style.css";
import { X, Plus } from "lucide-react";
import { editUser, getImageByFilename, uploadImage } from "../../../services/Registry";

function Profile({ user }: { user: any }) {
    const [bio, setBio] = useState(user.minderRoleInfo.bio);
    const [availability, setAvailability] = useState(user.minderRoleInfo.availability);
    const [distanceRange, setDistanceRange] = useState(user.minderRoleInfo.distanceRange);
    const [pictures, setPictures] = useState(user.minderRoleInfo.pictures.map((pic: any) => getFullFilePath(`user_images/${pic}`)));
    const [originalState, setOriginalState] = useState({ bio, availability, distanceRange, pictures });
    const [showImageViewer, setShowImageViewer] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchImage(filename: string) {
            return await getImageByFilename(filename);
        }

        setPictures(user.minderRoleInfo.pictures.map(async (pic: any) => {
            const response = await fetchImage(pic);
            return response;
        }));

        setLoading(false);

    }, [loading]);

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
    const handleAddPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadedFilename = await uploadImage(e.target.files[0]);

            if (uploadedFilename) {
                setPictures((prev: any) => [...prev, uploadedFilename]);
            } else {
                alert("Image upload failed.")
            }
            console.log(pictures);
        }
    };

    // Remove picture
    const handleRemovePicture = (index: number) => {
        setPictures(pictures.filter((_: any, i: number) => i !== index));
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
    const handleSave = async () => {
        setOriginalState({ bio, availability, distanceRange, pictures });

        await editUser(user.userDetails.id, {
            minderRoleInfo: {
                bio,
                availability,
                distanceRange,
                pictures: pictures.map((pic: any) => pic.split("/").pop())
            }
        });

        setHasUnsavedChanges(false);
    };

    return (
        <div className={`${dashboardStyles.dashboardSection} ${styles.profile}`}>
            <h2>Public Profile</h2>
            <p>Manage your public profile which others users see.</p>

            <label>About Me</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

            <label>Availability</label>
            <input type="text" value={availability} onChange={(e) => setAvailability(e.target.value)} />

            <label>Travel Distance Range</label>
            <div className={styles.sliderContainer}>
                <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    step="0.5"
                    value={distanceRange} 
                    onChange={(e) => setDistanceRange(Number(e.target.value))} 
                />
                <span className={styles.sliderValue}>{distanceRange} mi</span>
            </div>

            <label>Photos</label>
            <div className={styles.photoGrid}>
                {pictures.map((pic: any, index: number) => (
                    <div key={index} className={styles.photoItem}>
                        <img src={pic} alt="Profile" onClick={() => setShowImageViewer(pic)} />
                        <button className={styles.removeBtn} onClick={() => handleRemovePicture(index)}><X strokeWidth={2.25} /></button>
                    </div>
                ))}
                <label className={styles.addImage}>
                    <Plus strokeWidth={1} size={50}/>
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={handleAddPicture} />
                </label>
            </div>

            <div className={styles.buttonGroup}>
                <button className={`btn2 btn-secondary`} onClick={handleCancel}>Cancel</button>
                <button className={`btn2 btn-primary`} onClick={handleSave}>Confirm</button>
            </div>

            {showImageViewer && <ImageViewer imageSrc={showImageViewer} onClose={() => setShowImageViewer(null)} />}
        </div>
    );
}

export default Profile;
