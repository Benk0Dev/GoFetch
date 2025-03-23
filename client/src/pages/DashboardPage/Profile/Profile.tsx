import { useState, useEffect } from "react";
import styles from "./Profile.module.css";
import dashboardStyles from "../DashboardPage.module.css";
import ImageViewer from "./ImageViewer";
import "react-range-slider-input/dist/style.css";
import { X, Plus } from "lucide-react";
import { editUser, getImageByFilename, uploadImage } from "../../../services/Registry";
import { useAuth } from "../../../context/AuthContext";

function Profile() {
    const { user, setUser } = useAuth();

    const [bio, setBio] = useState(user.minderRoleInfo.bio);
    const [availability, setAvailability] = useState(user.minderRoleInfo.availability);
    const [distanceRange, setDistanceRange] = useState(user.minderRoleInfo.distanceRange);
    const [pictureFileNames, setPictureFileNames] = useState<string[]>(user.minderRoleInfo.pictures);
    const [pictures, setPictures] = useState<string[]>([]);
    const [pendingFiles, setPendingFiles] = useState<File[]>([]);
    const [originalState, setOriginalState] = useState({ bio, availability, distanceRange, pictureFileNames, pictures });
    const [showImageViewer, setShowImageViewer] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [picturesLoading, setPicturesLoading] = useState(true);

    useEffect(() => {
        async function fetchPictures() {
            const fetched = await Promise.all(
                user.minderRoleInfo.pictures.map(async (pic: string) => {
                    const response = await getImageByFilename(pic);
                    return response;
                })
            );
            return fetched;
        }

        async function initialize() {
            const fetchedPictures = await fetchPictures();
            setPictures(fetchedPictures);
            setOriginalState({ bio, availability, distanceRange, pictureFileNames, pictures: fetchedPictures });
            setPicturesLoading(false);
        }

        initialize();
    }, []);

    useEffect(() => {
        setHasUnsavedChanges(
            bio !== originalState.bio ||
            availability !== originalState.availability ||
            distanceRange !== originalState.distanceRange ||
            pictures.join() !== originalState.pictures.join()
        );
    }, [bio, availability, distanceRange, pictures]);

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
            setDistanceRange(originalState.distanceRange);
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
                distanceRange,
                pictures: newPictureFileNames,
            }
        };

        await editUser(user.userDetails.id, updatedData);

        const updatedUser = {
            ...user,
            minderRoleInfo: {
                ...user.minderRoleInfo,
                ...updatedData.minderRoleInfo
            }
        };

        setUser(updatedUser);
        setPendingFiles([]);
        setOriginalState({ bio, availability, distanceRange, pictureFileNames: newPictureFileNames, pictures });
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
                {picturesLoading ? (
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
                    <input type="file" accept="image/*" className={styles.fileInput} onChange={handleAddPicture} />
                </label>
            </div>

            <div className={styles.buttonGroup}>
                <button className={`btn2 btn-secondary`} onClick={handleCancel} disabled={!hasUnsavedChanges}>Cancel</button>
                <button className={`btn2 btn-menu`} onClick={handleSave} disabled={!hasUnsavedChanges}>Confirm</button>
            </div>

            {showImageViewer && <ImageViewer imageSrc={showImageViewer} onClose={() => setShowImageViewer(null)} />}
        </div>
    );
}

export default Profile;
