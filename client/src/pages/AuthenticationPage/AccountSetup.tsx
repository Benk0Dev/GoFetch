import { useAuth } from "@client/context/AuthContext";
import { Role } from "@gofetch/models/IUser";
import { ArrowLeft, ArrowRight, Check, Upload, Camera, X, Plus } from "lucide-react";
import styles from "@client/pages/AuthenticationPage/AuthenticationPage.module.css";
import { useRef, useState } from "react";
import defaultUser from "@client/assets/images/default-profile-picture.svg";
import { useNavigate } from "react-router-dom";
import AddPet from "@client/pages/DashboardPage/Pets/AddPet";

function AccountSetup({ step, onStepChange }: { step: number; onStepChange: (step: number) => void }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [picture, setPicture] = useState<string>(defaultUser);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [addPetVisible, setAddPetVisible] = useState(false);

    const handleProfilePicture = () => {
        onStepChange(1);
    }

    const handleUploadClick = (e: React.MouseEvent) => {
        e.preventDefault();
        fileInputRef.current?.click();
    }

    const handleAddPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewURL = URL.createObjectURL(file);
            setPicture(previewURL);
            setPendingFile(file);
        }
    };

    const handleRemovePicture = () => {
        setPicture(defaultUser);
        setPendingFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePets = async () => {
    }

    const handleAddPet = () => {
        setAddPetVisible(true);
    }

    const handleMinderProfile = async () => {
    }

    const handleServices = async () => {

    }

    const handleSubmit = async () => {

    }

    // Keydown event handler to handle "Enter" key press for next button
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (step === 0) {
                handleProfilePicture();
            } else if (step === 1) {
                user.currentRole === Role.OWNER ? handlePets() : handleMinderProfile();
            } else if (step === 2) {
                handleServices();
            }
        }
    };

    if (addPetVisible) {
        return <AddPet />;
    }

    return (
        <form onSubmit={user.currentRole === Role.OWNER ? handlePets : handleServices} onKeyDown={handleKeyDown}>
            {step === 0 && (
                <div className={styles.profilePicture}>
                    <div className={styles.profilePictureCustomization}>
                        <input type="file" accept="image/jpeg, image/png, image/gif" ref={fileInputRef} onChange={handleAddPicture} />
                        <div>
                            {picture === defaultUser ? (
                                <div className={styles.uploadImage} onClick={handleUploadClick}>
                                    <Camera size={40} strokeWidth={2} />
                                    <span>Click to upload</span>
                                    <p>JPG, PNG, GIF</p>
                                </div>
                            ) : (
                                <div className = {styles.uploadedImage}>
                                    <img src={picture} alt="Profile Picture" />
                                    <div className={styles.removePicture} onClick={handleRemovePicture}>
                                        <X size={12} strokeWidth={2} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={handleUploadClick} className={`btn btn-transparent ${styles.registerFormButton}`} style={{width: "fit-content"}}>
                            <Upload size={18} strokeWidth={2} />Choose a file
                        </button>
                    </div>
                    <div className={styles.registerFormButtons}>
                        <button onClick={handleProfilePicture} className={`btn btn-primary ${styles.registerFormButton}`}>
                        Next<ArrowRight size={18} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            )}
            {step === 1 && user.currentRole === Role.OWNER && (
                <>
                    <div className={styles.pets}>
                        {user.ownerRoleInfo.pets.map((pet: any) => {
                            return (
                                <h3>{pet.name}</h3>
                            );
                        })}
                        
                        <button className={`btn btn-primary ${styles.registerFormButton}`} style={{width: "fit-content"}} onClick={handleAddPet}>
                        <Plus size={18} strokeWidth={2} />Add New Pet
                        </button>
                    </div>

                    <div className={styles.registerFormButtons}>
                        <button onClick={() => onStepChange(0)} className={`btn btn-secondary ${styles.registerFormButton}`}>
                        <ArrowLeft size={18} strokeWidth={2} />Back
                        </button>
                        <button onClick={handlePets} className={`btn btn-primary ${styles.registerFormButton}`}>
                        <Check size={18} strokeWidth={2} />Finish
                        </button>
                    </div>
                </>
            )}
            {step === 1 && user.currentRole === Role.MINDER && (
                <>
                    <div className={styles.registerFormButtons}>
                        <button onClick={() => onStepChange(0)} className={`btn btn-secondary ${styles.registerFormButton}`}>
                        <ArrowLeft size={18} strokeWidth={2} />Back
                        </button>
                        <button onClick={handleMinderProfile} className={`btn btn-primary ${styles.registerFormButton}`}>
                        Next<ArrowRight size={18} strokeWidth={2} />
                        </button>
                    </div>
                </>
            )}
            {step === 2 && user.currentRole === Role.MINDER && (
                <>
                    <div className={styles.registerFormButtons}>
                        <button onClick={() => onStepChange(0)} className={`btn btn-secondary ${styles.registerFormButton}`}>
                        <ArrowLeft size={18} strokeWidth={2} />Back
                        </button>
                        <button onClick={handleServices} className={`btn btn-primary ${styles.registerFormButton}`}>
                        <Check size={18} strokeWidth={2} />Finish
                        </button>
                    </div>
                </>
            )}
        </form>
    );
}
export default AccountSetup;