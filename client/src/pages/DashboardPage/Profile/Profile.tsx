import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import styles from "@client/pages/DashboardPage/Profile/Profile.module.css";
import dashboardStyles from "@client/pages/DashboardPage/Dashboard.module.css";
import ImageViewer from "@client/components/ImageViewer";
import "react-range-slider-input/dist/style.css";
import { editUser, getUserById } from "@client/services/UserRegistry";
import { uploadImage } from "@client/services/ImageRegistry";
import { useAuth } from "@client/context/AuthContext";
import { Availability } from "@gofetch/models/IUser";

function Profile() {
    const { user, refreshUser } = useAuth();
    const [bio, setBio] = useState(user.minderRoleInfo.bio);
    const [availability, setAvailability] = useState(user.minderRoleInfo.availability);
    const [pictures, setPictures] = useState<string[]>([...user.minderRoleInfo.pictures]);
    const [pictureFileNames, setPictureFileNames] = useState<string[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [originalState, setOriginalState] = useState({ bio, availability, pictures, pictureFileNames });
    const [showImageViewer, setShowImageViewer] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [pictureIdsLoading, setpictureIdsLoading] = useState(true);

    useEffect(() => {
        async function initialize() {
            const fetchedUser = await getUserById(user.id);
            const pictureFileNames = [...fetchedUser.minderRoleInfo.pictures];
            setPictureFileNames(pictureFileNames);
            setOriginalState({ bio, availability, pictures, pictureFileNames: pictureFileNames });
            setpictureIdsLoading(false);
        }
        initialize();
    }, []);

    useEffect(() => {
        setHasUnsavedChanges(
            bio !== originalState.bio ||
            availability !== originalState.availability ||
            pictures.join() !== originalState.pictures.join()
        );
    }, [bio, availability, pictures]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const handleAddPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewURL = URL.createObjectURL(file);
            setPictures(prev => [...prev, previewURL]);
            setPendingFiles(prev => [...prev, file]);
        }
    };

    const handleRemovePicture = (index: number) => {
        if (index > originalState.pictures.length - 1) {
            setPendingFiles(pendingFiles.filter((_, i) => i !== index - originalState.pictures.length));
            setPictures(pictures.filter((_, i) => i !== index));
            return;
        }
        setPictureFileNames(pictureFileNames.filter((_, i) => i !== index));
        setPictures(pictures.filter((_, i) => i !== index));
    };

    const handleCancel = () => {
        if (confirm("Are you sure you want to cancel? Your changes will be lost.")) {
            setBio(originalState.bio);
            setAvailability(originalState.availability);
            setPictures(originalState.pictures);
            setPendingFiles([]);
            setHasUnsavedChanges(false);
        }
    };

    const handleSave = async () => {
        const uploadedFilenames: string[] = [];

        for (const file of pendingFiles) {
            const filename = await uploadImage(file);
            if (filename) {
                uploadedFilenames.push(filename);
            } else {
                alert("Failed to upload image.");
                return;
            }
        }

        const newPictureFileNames = [...pictureFileNames, ...uploadedFilenames];
        setPictureFileNames(newPictureFileNames);

        const updatedData = {
            minderRoleInfo: {
                bio,
                availability,
                pictures: newPictureFileNames,
            }
        };

        await editUser(user.id, updatedData);

        refreshUser();
        setPendingFiles([]);
        setOriginalState({ bio, availability, pictureFileNames: newPictureFileNames, pictures });
        setHasUnsavedChanges(false);
    };

    return (
        <div className={`${dashboardStyles.dashboardSection} ${styles.profile}`}>
            <h2>Public Profile</h2>
            <p>Manage your public profile which others users see.</p>

            <label>About Me</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

            <label>Availability</label>
            <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as Availability)}
            >
                {Object.entries(Availability).map(([key, label]) => (
                    <option key={key} value={label}>{label}</option>
                ))}
            </select>

            <label>Photos</label>
            <div className={styles.photoGrid}>
                {pictureIdsLoading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : (
                    pictures.map((pic, index) => (
                        <div key={index} className={styles.photoItem}>
                            <img src={pic} alt="Profile" onClick={() => setShowImageViewer(pic)} />
                            <button className={styles.removeBtn} onClick={() => handleRemovePicture(index)}><X strokeWidth={2.25} /></button>
                        </div>
                    ))
                )}
                <label className={styles.addImage}>
                    <Plus strokeWidth={1} size={50} />
                    <input type="file" accept="image/jpeg, image/png, image/gif" className={styles.fileInput} onChange={handleAddPicture} />
                </label>
            </div>

            <div className={styles.buttonGroup}>
                <button className={`btn btn-secondary`} onClick={handleCancel} disabled={!hasUnsavedChanges}>Cancel</button>
                <button className={`btn btn-primary`} onClick={handleSave} disabled={!hasUnsavedChanges}>Confirm</button>
            </div>

            {showImageViewer && <ImageViewer imageSrc={showImageViewer} onClose={() => setShowImageViewer(null)} />}
        </div>
    );
}

export default Profile;
