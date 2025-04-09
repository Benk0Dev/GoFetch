import { useState, useEffect, useRef } from "react";
import { useAuth } from "@client/context/AuthContext";
import { IAddress } from "@gofetch/models/IUser";
import { editUser, verifyUniqueEmail } from "@client/services/UserRegistry";
import { uploadImage } from "@client/services/ImageRegistry";
import styles from "./EditProfilePage.module.css";
import defaultProfilePic from "@client/assets/images/default-profile-picture.svg";
import BackButton from "@client/components/BackButton";
import { X, Upload } from "lucide-react";
import { geocodeAddress, loadGooglePlacesScript } from "@client/services/googleApi";

function Profile() {
    const { user, refreshUser } = useAuth();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Profile picture
    const [profilePicture, setProfilePicture] = useState(user.primaryUserInfo.profilePic);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Personal information
    const [fname, setFname] = useState(user.name.fname);
    const [sname, setSname] = useState(user.name.sname);
    const [email, setEmail] = useState(user.loginDetails.email);
    const [personalInformationError, setPersonalInformationError] = useState<string>("");

    // Address
    const [address, setAddress] = useState<IAddress>(user.primaryUserInfo.address);
    const [addressError, setAddressError] = useState<string>("");

    // Load Google Places Script on component mount
    useEffect(() => {
        loadGooglePlacesScript();
    }, []);

    useEffect(() => {
        setHasUnsavedChanges(
            fname !== user.name.fname ||
            sname !== user.name.sname ||
            email !== user.loginDetails.email ||
            JSON.stringify(address) !== JSON.stringify(user.primaryUserInfo.address) ||
            profilePicture !== user.primaryUserInfo.profilePic
        );
    }, [fname, sname, email, address, profilePicture]);

    const handleUploadClick = (e: React.MouseEvent) => {
        e.preventDefault();
        fileInputRef.current?.click();
    }

    const handleAddPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewURL = URL.createObjectURL(file);
            setProfilePicture(previewURL);
            setSelectedFile(file);
        }
    };

    const handleRemovePicture = () => {
        setProfilePicture(defaultProfilePic);
        setSelectedFile(null);
    };

    const handleCancel = async () => {
        if (confirm("Are you sure you want to discard your changes?")) {
            setFname(user.name.fname);
            setSname(user.name.sname);
            setEmail(user.loginDetails.email);
            setAddress(user.primaryUserInfo.address);
            setProfilePicture(user.primaryUserInfo.profilePic);
            setSelectedFile(null);
            setHasUnsavedChanges(false);
            setPersonalInformationError("");
            setAddressError("");
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setPersonalInformationError("");
        setAddressError("");

        let isValid = true;

        // Validate personal information
        const nameRegex = /^[A-Za-z]+$/;
        
        if (!nameRegex.test(fname) || !nameRegex.test(sname)) {
            setPersonalInformationError("Name should contain only letters.");
            isValid = false;
        }

        if (email !== user.loginDetails.email) {
            const notUnique = await verifyUniqueEmail(email);
            if (notUnique) {
                if (notUnique.email) {
                    setPersonalInformationError("Email is already in use.");
                    isValid = false;
                }
            }
        }

        // Validate address
        if (!address.street || !address.city || !address.postcode || !address.country) {
        setAddressError("Please fill in all address fields.");
        isValid = false;
        }

        // Combine all parts of the address into one string
        const fullAddress = `${address.street}, ${address.city}, ${address.postcode}, ${address.country}`;

        try {
            const results = await geocodeAddress(fullAddress);

            if (!results || results.length === 0) {
                setAddressError("Address is not valid. Please verify the address.");
                isValid = false;
            }

            // Validate the address components
            const addressComponents = results[0].address_components;

            // Check for essential components: street, city, postcode, country
            const streetComponent = addressComponents.find((component) =>
                component.types.includes("premise")
            );
            const streetNumberComponent = addressComponents.find((component) =>
                component.types.includes("street_number")
            );
            const streetNameComponent = addressComponents.find((component) =>
                component.types.includes("route")
            );
            const cityComponent = addressComponents.find((component) =>
                component.types.includes("postal_town")
            );
            const postcodeComponent = addressComponents.find((component) =>
                component.types.includes("postal_code")
            );
            const countryComponent = addressComponents.find((component) =>
                component.types.includes("country")
            );

            if ((!streetComponent && !(streetNumberComponent && streetNameComponent)) || !cityComponent || !postcodeComponent || !countryComponent) {
                setAddressError("Please enter a valid address with all necessary components.");
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            const newAddress = {
                street: streetNumberComponent && streetNameComponent ? streetNumberComponent.long_name + " " + streetNameComponent.long_name : streetComponent ? streetComponent.long_name : "",
                city: cityComponent?.long_name || "",
                postcode: postcodeComponent?.long_name || "",
                country: countryComponent?.long_name || "",
            };

            // Autofill the form with the correct data
            setAddress(newAddress);

            // Profile picture upload
            let filename;
            let changedProfilePic = true;
            if (selectedFile) {
                filename = await uploadImage(selectedFile);
                if (!filename) {
                    alert("Failed to upload image.");
                    return;
                }
            } else if (profilePicture === defaultProfilePic) {
                filename = "";
            } else {
                changedProfilePic = false;
            }

            let updatedUser;

            if (changedProfilePic) {
                updatedUser = {
                    name: {
                        fname,
                        sname,
                    },
                    loginDetails: {
                        email,
                    },
                    primaryUserInfo: {
                        profilePic: filename,
                        address: newAddress,
                    }
                };
            } else {
                updatedUser = {
                    name: {
                        fname,
                        sname,
                    },
                    loginDetails: {
                        email,
                    },
                    primaryUserInfo: {
                        address: newAddress,
                    }
                };
            }

            await editUser(user.id, updatedUser);
            refreshUser();
            setSelectedFile(null);
            setHasUnsavedChanges(false);

        } catch (error) {
            setAddressError("Failed to validate address. Please check your address.");
            console.error("Error validating address:", error);
        }
    };

    return (
        <div className={`container ${styles.profileContainer}`}>
            <BackButton />
            <div className={styles.profilePage}>
                <h2>Edit Profile</h2>
                <div className={styles.profilePictureCustomization}>
                    <input type="file" accept="image/jpeg, image/png, image/gif" ref={fileInputRef} onChange={handleAddPicture} />
                    <div>
                        {profilePicture !== defaultProfilePic ? (
                            <div className = {styles.image}>
                                <img src={profilePicture} alt="Profile Picture" />
                                <div className={styles.removePicture} onClick={handleRemovePicture}>
                                    <X size={12} strokeWidth={2} />
                                </div>
                            </div>
                        ) : (
                            <div className = {styles.image}>
                                <img src={profilePicture} alt="Profile Picture" />
                            </div>
                        )}
                    </div>
                    <button onClick={handleUploadClick} className={`btn btn-transparent black-hover ${styles.registerFormButton}`} style={{width: "fit-content"}}>
                        <Upload size={18} strokeWidth={2} />Choose a file
                    </button>
                </div>
                <hr />
                <form onSubmit={handleSave} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}>
                    <div className={styles.inputSectionContainer}>
                        <span>Personal Information</span>
                        <div className={styles.doubleRow}>
                            <div className={styles.input}>
                                <label>First Name</label>
                                <input type="text" value={fname} placeholder={user.name.fname} onChange={(e) => setFname(e.target.value)} required />
                            </div>
                            <div className={styles.input}>
                                <label>Last Name</label>
                                <input type="text" value={sname} placeholder={user.name.sname} onChange={(e) => setSname(e.target.value)} required />
                            </div>
                        </div>
                        <div className={styles.input}>
                            <label>Email</label>
                            <input 
                                type="email" 
                                value={email} 
                                placeholder={user.loginDetails.email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <p className={styles.error}>{personalInformationError}</p>
                    </div>
                    <hr />
                    <div className={styles.inputSectionContainer}>
                        <span>Address</span>
                        <div className={styles.input}>
                            <label>Street Address</label>
                            <input
                                type="text"
                                value={address.street}
                                placeholder={user.primaryUserInfo.address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.input}>
                            <label>City</label>
                            <input
                                type="text"
                                value={address.city}
                                placeholder={user.primaryUserInfo.address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.input}>
                            <label>Postcode</label>
                            <input
                                type="text"
                                value={address.postcode}
                                placeholder={user.primaryUserInfo.address.postcode}
                                onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                                required
                            />
                        </div>
                        <div className={styles.input}>
                            <label>Country</label>
                            <input
                                type="text"
                                value={address.country}
                                placeholder={user.primaryUserInfo.address.country}
                                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                                required
                            />
                        </div>
                        <p className={styles.error}>{addressError}</p>
                    </div>
                    <hr />
                    <div className={styles.buttons}>
                        <button type="button" disabled={!hasUnsavedChanges} onClick={handleCancel} className={`btn btn-secondary ${!hasUnsavedChanges ? "disabled" : ""}`}>
                            Cancel
                        </button>
                        <button type="submit" disabled={!hasUnsavedChanges} className={`btn btn-primary ${!hasUnsavedChanges ? "disabled" : ""}`}>
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
