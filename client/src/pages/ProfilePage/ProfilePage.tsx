// import { useState, useEffect } from "react";
// import { useAuth } from "../../context/AuthContext";
// import { IAddress, IUser, Role } from "@gofetch/models/IUser";
// import { uploadImage, editUser } from "../../services/Registry";
// import styles from "./ProfilePage.module.css";
// import "../../global.css";
// import defaultProfilePic from "../../assets/images/default-profile-picture.svg";

// function Profile() {
//     const { user, refreshUser } = useAuth();
//     const [name, setName] = useState<string>(`${user.name.fname} ${user.name.sname}`);
//     const [email, setEmail] = useState<string>(user.loginDetails.email);
//     const [address, setAddress] = useState<IAddress>(user.primaryUserInfo.address);
//     const [role] = useState<Role>(user.currentRole);
//     // const [profilePicture, setProfilePicture] = useState<string>(user.primaryUserInfo.profilePic);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [, setShowImageViewer] = useState(false);
//     const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//     const [profilePicture, setProfilePicture] = useState<string>(
//         user.primaryUserInfo.profilePic && user.primaryUserInfo.profilePic !== "null"
//             ? user.primaryUserInfo.profilePic
//             : defaultProfilePic
//     );
//     console.log("profilePicture", profilePicture);
//     console.log("selectedFile", selectedFile);
//     console.log("name", name);


//     useEffect(() => {
//         setHasUnsavedChanges(
//             name !== `${user.name.fname} ${user.name.sname}` ||
//             email !== user.loginDetails.email ||
//             JSON.stringify(address) !== JSON.stringify(user.primaryUserInfo.address) ||
//             role !== user.currentRole ||
//             profilePicture !== null
//         );
//     }, [name, email, address, role, profilePicture]);

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             setSelectedFile(file);
//             setProfilePicture(URL.createObjectURL(file));
//         }
//     };
    

//     const handleSave = async () => {
//         let updatedProfilePicture = profilePicture;

//         if (selectedFile) {
//             try {
//                 const uploadedUrl = await uploadImage(selectedFile);
//                 if (uploadedUrl) {
//                     updatedProfilePicture = uploadedUrl;
//                 } else {
//                     alert("Failed to upload image.");
//                     return;
//                 }
//             } catch (error) {
//                 console.error("Image upload error:", error);
//                 alert("Error uploading image.");
//                 return;
//             }
//         }

//         const updatedUser: IUser = {
//             ...user,
//             name: { fname: name.split(" ")[0], sname: name.split(" ")[1] },
//             loginDetails: { ...user.loginDetails, email },
//             primaryUserInfo: {
//                 ...user.primaryUserInfo,
//                 address,
//                 profilePic: updatedProfilePicture
//             }
//         };

//         try {
//             await editUser(user.id, updatedUser);
//             await refreshUser();
//             setSelectedFile(null);
//             setHasUnsavedChanges(false);
//         } catch (error) {
//             console.error("Error updating user:", error);
//             alert("Failed to save changes.");
//         }
//         console.log("profilePicture", profilePicture);
//         console.log("selectedFile", selectedFile);
//         console.log("name", name);

//     };

//     const handleDeletePicture = async () => {
//         try {
//             const updatedUser: IUser = {
//                 ...user,
//                 primaryUserInfo: { 
//                     ...user.primaryUserInfo, 
//                     profilePic: defaultProfilePic 
//                 }
//             };
    
//             await editUser(user.id, updatedUser);
//             setProfilePicture(defaultProfilePic); 
//             await refreshUser();  
//         } catch (error) {
//             console.error("Error deleting profile picture:", error);
//             alert("Failed to delete profile picture.");
//         }
//     };

//     const deleteChanges = async () => {
//         if (confirm("Are you sure you want to discard your changes?")) {
//             setName(`${user.name.fname} ${user.name.sname}`);
//             setEmail(user.loginDetails.email);
//             setAddress(user.primaryUserInfo.address);
//             setProfilePicture(user.primaryUserInfo.profilePic);
//             setSelectedFile(null);
//             setHasUnsavedChanges(false);
//             await refreshUser();
//         }
//     };

//     return (
//         <div className={styles.page}>
//             <h2>Your Profile</h2>
//             <div className={styles.imageArea}>
//                 <div className={styles.img}>
//                     <img
//                         src={profilePicture || defaultProfilePic}
//                         alt="Profile"
//                         onClick={() => setShowImageViewer(true)}
//                     />
//                 </div>
//                 <label htmlFor="fileInput" className={styles.customFileButton}>
//                     Choose Profile Picture
//                 </label>
//                 <input
//                     id="fileInput"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     style={{ display: "none" }}
//                 />
//                 {profilePicture && profilePicture !== defaultProfilePic && (
//                     <button onClick={() => handleDeletePicture()}>Delete Picture</button>
//                 )}
//             </div>
            
//             <div className={styles.inputContainer}>
//                 <div className={styles.input}>
//                     <label>Name</label>
//                     <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
//                 </div>
//                 <div className={styles.input}>
//                     <label>Email</label>
//                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//                 </div>
//                 <div className={styles.input}>
//                     <label>Street</label>
//                     <input
//                         type="text"
//                         value={address.street}
//                         onChange={(e) => setAddress({ ...address, street: e.target.value })}
//                     />
//                 </div>
//                 <div className={styles.input}>
//                     <label>City</label>
//                     <input
//                         type="text"
//                         value={address.city}
//                         onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                     />
//                 </div>
//                 <div className={styles.input}>
//                     <label>Postcode</label>
//                     <input
//                         type="text"
//                         value={address.postcode}
//                         onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
//                     />
//                 </div>
//                 <div className={styles.input}>
//                     <label>Country</label>
//                     <input
//                         type="text"
//                         value={address.country}
//                         onChange={(e) => setAddress({ ...address, country: e.target.value })}
//                     />
//                 </div>
//                 <div className={styles.input}>
//                     <label>Registered Role/s</label>
//                     <ul>
//                         {(Array.isArray(user.roles) ? user.roles : [user.roles]).map((roleOption: Role) => (
//                             <li key={roleOption}>{roleOption}</li>
//                         ))}
//                     </ul>
//                 </div>

//                 <div>
//                     <button
//                         disabled={!hasUnsavedChanges}
//                         onClick={deleteChanges}
//                         className={`btn btn-secondary ${!hasUnsavedChanges ? "disabled" : ""}`}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         disabled={!hasUnsavedChanges}
//                         onClick={handleSave}
//                         className={`btn btn-secondary ${!hasUnsavedChanges ? "disabled" : ""}`}
//                     >
//                         Confirm
//                     </button>
//                     <button className={`btn btn-primary`}>
//                         <a href="../../Dashboard/profile">Public Profile</a>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Profile;

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { IAddress, IUser, Role } from "@gofetch/models/IUser";
import { uploadImage, editUser } from "../../services/Registry";
import styles from "./ProfilePage.module.css";
import "../../global.css";
import defaultProfilePic from "../../assets/images/default-profile-picture.svg";

function Profile() {
    const { user, refreshUser } = useAuth();
    
    // Log user's initial profile picture data
    console.log("User's initial profile picture:", user.primaryUserInfo.profilePic);

    const [name, setName] = useState<string>(`${user.name.fname} ${user.name.sname}`);
    const [email, setEmail] = useState<string>(user.loginDetails.email);
    const [address, setAddress] = useState<IAddress>(user.primaryUserInfo.address);
    const [role] = useState<Role>(user.currentRole);

    // Log profilePicture initialization state
    const [profilePicture, setProfilePicture] = useState<string>(
        user.primaryUserInfo.profilePic && user.primaryUserInfo.profilePic !== "null"
            ? user.primaryUserInfo.profilePic
            : defaultProfilePic
    );
    console.log("Profile picture initialized to:", profilePicture);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [, setShowImageViewer] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        // Log the state values inside the useEffect
        console.log("Checking unsaved changes:");
        console.log("name:", name);
        console.log("email:", email);
        console.log("address:", JSON.stringify(address));
        console.log("profilePicture:", profilePicture);

        setHasUnsavedChanges(
            name !== `${user.name.fname} ${user.name.sname}` ||
            email !== user.loginDetails.email ||
            JSON.stringify(address) !== JSON.stringify(user.primaryUserInfo.address) ||
            role !== user.currentRole ||
            profilePicture !== user.primaryUserInfo.profilePic
        );
    }, [name, email, address, role, profilePicture, user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log("Selected file:", file); // Log the selected file

            setSelectedFile(file);
            setProfilePicture(URL.createObjectURL(file));

            // Log the profile picture URL created from the file
            console.log("Profile picture preview URL:", URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        let updatedProfilePicture = profilePicture;
        console.log("Saving profile with picture:", updatedProfilePicture);

        if (selectedFile) {
            try {
                // Log before uploading the image
                console.log("Uploading image:", selectedFile);
                const uploadedUrl = await uploadImage(selectedFile);

                console.log("Uploaded image URL:", uploadedUrl); // Log the uploaded URL

                if (uploadedUrl) {
                    updatedProfilePicture = uploadedUrl;
                    console.log("Updated profile picture after upload:", updatedProfilePicture);
                } else {
                    alert("Failed to upload image.");
                    return;
                }
            } catch (error) {
                console.error("Image upload error:", error);
                alert("Error uploading image.");
                return;
            }
        }

        const updatedUser: IUser = {
            ...user,
            name: { fname: name.split(" ")[0], sname: name.split(" ")[1] },
            loginDetails: { ...user.loginDetails, email },
            primaryUserInfo: {
                ...user.primaryUserInfo,
                address,
                profilePic: updatedProfilePicture,
            }
        };

        try {
            console.log("Updating user with:", updatedUser);
            await editUser(user.id, updatedUser);
            await refreshUser();
            setSelectedFile(null);
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to save changes.");
        }
    };

    const handleDeletePicture = async () => {
        console.log("Deleting profile picture...");
        try {
            const updatedUser: IUser = {
                ...user,
                primaryUserInfo: { 
                    ...user.primaryUserInfo, 
                    profilePic: defaultProfilePic 
                }
            };

            console.log("Updated user after deleting picture:", updatedUser);
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
            console.log("Discarding changes...");
            setName(`${user.name.fname} ${user.name.sname}`);
            setEmail(user.loginDetails.email);
            setAddress(user.primaryUserInfo.address);
            setProfilePicture(user.primaryUserInfo.profilePic);
            setSelectedFile(null);
            setHasUnsavedChanges(false);
            await refreshUser();
        }
    };

    return (
        <div className={styles.page}>
            <h2>Your Profile</h2>
            <div className={styles.imageArea}>
                <div className={styles.img}>
                    <img
                        src={profilePicture || defaultProfilePic}
                        alt="Profile"
                        onClick={() => setShowImageViewer(true)}
                    />
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
            </div>

            <div className={styles.inputContainer}>
                <div className={styles.input}>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className={styles.input}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                        onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
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
                </div>

                <div>
                    <button
                        disabled={!hasUnsavedChanges}
                        onClick={deleteChanges}
                        className={`btn btn-secondary ${!hasUnsavedChanges ? "disabled" : ""}`}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={!hasUnsavedChanges}
                        onClick={handleSave}
                        className={`btn btn-secondary ${!hasUnsavedChanges ? "disabled" : ""}`}
                    >
                        Confirm
                    </button>
                    <button className={`btn btn-primary`}>
                        <a href="../../Dashboard/profile">Public Profile</a>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
