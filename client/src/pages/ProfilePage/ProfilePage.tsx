import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { IAddress, Role } from "@gofetch/models/IUser";
import { editUser, getUserById } from "../../services/UserRegistry";
import { uploadImage } from "../../services/ImageRegistry";
import styles from "./ProfilePage.module.css";
import "../../global.css";
import defaultProfilePic from "../../assets/images/default-profile-picture.svg";

function Profile() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState(`${user.name.fname} ${user.name.sname}`);
    const [email, setEmail] = useState(user.loginDetails.email);
    const [address, setAddress] = useState<IAddress>(user.primaryUserInfo.address);
    const [role] = useState<Role>(user.currentRole);
    const [profilePicture, setProfilePicture] = useState(user.primaryUserInfo.profilePic);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const postcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}|[A-Z]{1,2}\d{1,2} \d[A-Z]{2})$/i;
    const [postcodeError, setPostcodeError] = useState<string | null>(null);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    const [emailError, setEmailError] = useState<string | null>(null);

    
    useEffect(() => {
        async function initialize() {
            const fetchedUser = await getUserById(user.id);
            setProfilePicture(fetchedUser.primaryUserInfo.profilePic);
        }
        initialize();
    }, []);

    useEffect(() => {
        setHasUnsavedChanges(
            name !== `${user.name.fname} ${user.name.sname}` ||
            email !== user.loginDetails.email ||
            JSON.stringify(address) !== JSON.stringify(user.primaryUserInfo.address) ||
            selectedFile !== null
        );
    }, [name, email, address, role, selectedFile]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setProfilePicture(URL.createObjectURL(file)); // Show preview
        }
    };

    const handleSave = async () => {
        let uploadedUrl = profilePicture;
        if (selectedFile) {
            uploadedUrl = await uploadImage(selectedFile);
            if (!uploadedUrl) {
                alert("Failed to upload image.");
                return;
            }
        }

        if (address.postcode && !postcodeRegex.test(address.postcode)) {
            setPostcodeError("Invalid postcode format. Please enter a valid UK postcode.");
            alert(postcodeError)
            return;
        }

        if (!emailRegex.test(email)) {
            setEmailError("Invalid email format. Please enter a valid email address.");
            alert(emailError)
            return;
        }

        const updatedUser = {
            primaryUserInfo: {
                ...user.primaryUserInfo,
                profilePic: uploadedUrl,
                name,
                email,
                address,
            }
        };

        await editUser(user.id, updatedUser);
        refreshUser();
        setSelectedFile(null);
        setHasUnsavedChanges(false);
    };
    
    const handleDeletePicture = async () => {
        try {
            const updatedUser = {
                ...user,
                primaryUserInfo: { 
                    ...user.primaryUserInfo, 
                    profilePic: defaultProfilePic 
                }
            };
            
            await editUser(user.id, updatedUser);
            setProfilePicture(defaultProfilePic);
            await refreshUser();  
        } catch (error) {
            console.error("Error deleting profile picture:", error);
            alert("Failed to delete profile picture.");
        }
    };

    const deleteChanges = async () => {
        if (confirm("Are you sure you want to discard your changes?")) {
            setName(`${user.name.fname} ${user.name.sname}`);
            setEmail(user.loginDetails.email);
            setAddress(user.primaryUserInfo.address);
            setProfilePicture(user.primaryUserInfo.profilePic);
            setSelectedFile(null);
            setHasUnsavedChanges(false);
            await refreshUser();
        }
    };

    const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setAddress({ ...address, postcode: value });
        setPostcodeError(null); // Reset error on change
    };

    const handlePostcodeBlur = () => {
        if (address.postcode && !postcodeRegex.test(address.postcode)) {
            setPostcodeError("Invalid postcode format. Please enter a valid UK postcode.");
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);
        setEmailError(null); 
    };

    const handleEmailBlur = () => {
        if (!emailRegex.test(email)) {
            alert("Invalid email format. Please enter a valid email address.");
        }
    }


    return (
        <div className={styles.page}>
            <h2>Your Profile</h2>
            <div className={styles.imageArea}>
                <img src={profilePicture || defaultProfilePic} alt="Profile" className={styles.img} />
            </div>
            <label htmlFor="fileInput" className={styles.customFileButton}>
                Choose Profile Picture
            </label>
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
            />
            {profilePicture && profilePicture !== defaultProfilePic && (
                <button onClick={handleDeletePicture}>Delete Picture</button>
            )}
            <div className={styles.inputContainer}>
                <div className={styles.input}>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={styles.input}>
                     <label>Email</label>
                     <input 
                        type="email" 
                        value={email} 
                        onChange={handleEmailChange} 
                        onBlur={handleEmailBlur} 
                     />

                </div>
                <div className={styles.input}>
                    <label>Street</label>
                    <input
                        type="text"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                </div>
                <div className={styles.input}>
                    <label>City</label>
                    <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                </div>
                <div className={styles.input}>
                     <label>Postcode</label>
                    <input
                        type="text"
                        value={address.postcode}
                        onChange={handlePostcodeChange}
                        onBlur={handlePostcodeBlur}
                    />

                </div>
                <div className={styles.input}>
                    <label>Country</label>
                    <input
                        type="text"
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    />
                </div>
                <div className={styles.input}>
                    <label>Registered Role/s</label>
                    <ul>
                        {(Array.isArray(user.roles) ? user.roles : [user.roles]).map((roleOption: Role) => (
                            <li key={roleOption}>{roleOption}</li>
                        ))}
                    </ul>
                <div>
                    <button disabled={!hasUnsavedChanges} onClick={deleteChanges} className={`btn btn-secondary ${!hasUnsavedChanges ? "disabled" : ""}`}>
                        Cancel
                    </button>
                    <button disabled={!hasUnsavedChanges} onClick={handleSave} className={`btn btn-secondary ${!hasUnsavedChanges ? "disabled" : ""}`}>
                        Confirm
                    </button>
                    <button className={`btn btn-primary`}>
                        <a href="../../Dashboard/profile">Public Profile</a>
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
}

export default Profile;
