import { useState, useEffect, useRef } from "react";
import styles from "@client/pages/AuthenticationPage/AuthenticationPage.module.css";
import { registerUser, verifyUniqueEmail } from "@client/services/UserRegistry";
import { uploadImage } from "@client/services/ImageRegistry";
import { IRegisterdUser, Role } from "@gofetch/models/IUser";
import { useAuth } from "@client/context/AuthContext";
import { loadGooglePlacesScript, geocodeAddress } from "@client/services/googleApi";
import { ArrowLeft, ArrowRight, Check, Camera, Upload, X } from "lucide-react";
import defaultUser from "@client/assets/images/default-profile-picture.svg";

function RegisterForm({ step, onStepChange }: { step: number; onStepChange: (step: number) => void }) {
    const { loginUser } = useAuth();

    // Step 1: Personal Information
    const [fname, setFname] = useState("");
    const [sname, setSname] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");

    // Step 2: Address Information
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [postcode, setPostcode] = useState("");
    const [country, setCountry] = useState("");

    // Step 3: Account and Role
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [role, setRole] = useState(Role.OWNER);

    // Step 4: Profile Picture
    const [picture, setPicture] = useState<string>(defaultUser);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Error States
    const [fnameError, setFnameError] = useState("");
    const [snameError, setSnameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [dobError, setDobError] = useState("");
    const [addressError, setAddressError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [password2Error, setPassword2Error] = useState("");
    const [profilePictureError, setProfilePictureError] = useState("");

    // Load Google Places Script on component mount
    useEffect(() => {
        loadGooglePlacesScript();
    }, []);

    // Step 1 Validation
    const handleFirstNext = async (e: React.FormEvent) => {
        e.preventDefault();
        setFnameError("");
        setSnameError("");
        setEmailError("");
        setDobError("");

        let error = false;

        const nameRegex = /^[A-Za-z]+$/;

        if (!nameRegex.test(fname)) {
        setFnameError("First name should contain only letters.");
        error = true;
        }

        if (!nameRegex.test(sname)) {
        setSnameError("Last name should contain only letters.");
        error = true;
        }

        const notUnique = await verifyUniqueEmail(email);
        if (notUnique) {
        if (notUnique.email) {
            setEmailError("Email is already in use.");
            error = true;
        }
        }

        if (error) return;

        onStepChange(1);
    };

    // Step 2 Validation and Address Validation
    const handleSecondNext = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddressError("");

        if (!street || !city || !postcode || !country) {
        setAddressError("Please fill in all address fields.");
        return;
        }

        // Combine all parts of the address into one string
        const address = `${street}, ${city}, ${postcode}, ${country}`;

        try {
        const results = await geocodeAddress(address);

        if (!results || results.length === 0) {
            setAddressError("Address is not valid. Please verify the address.");
            return;
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
            return;
        }

        // Autofill the form with the correct data
        setStreet(streetNumberComponent && streetNameComponent ? streetNumberComponent.long_name + " " + streetNameComponent.long_name : streetComponent ? streetComponent.long_name : "");
        setCity(cityComponent.long_name);
        setPostcode(postcodeComponent.long_name);
        setCountry(countryComponent.long_name);

        onStepChange(2);

        } catch (error) {
        setAddressError("Failed to validate address. Please check your address.");
        }
    };

    // Step 3 Validation
    const handleThirdNext = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");
        setPassword2Error("");

        let error = false;

        if (password.length < 8) {
        setPasswordError("Password should be at least 8 characters long.");
        error = true;
        }

        if (password !== password2) {
        setPassword2Error("Passwords do not match.");
        error = true;
        }

        if (error) return;

        onStepChange(3);
    };

    // Step 4 Profile Picture and Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let filename: string | undefined;

        if (pendingFile) {
            filename = await uploadImage(pendingFile);
            if (!filename) {
                setProfilePictureError("Failed to upload image.");
                return;
            }
        }

        const capitalize = (str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase());

        const userDetails: IRegisterdUser = {
        fname: capitalize(fname),
        sname: capitalize(sname),
        email,
        dob: new Date(dob),
        address: {
            street: capitalize(street),
            city: capitalize(city),
            postcode: postcode.toUpperCase(),
            country: capitalize(country),
        },
        password,
        role,
        profilePic: filename,
        };

        const newUser = await registerUser(userDetails);

        if (newUser) {
        loginUser(newUser.id);
        onStepChange(4);
        } else {
        console.log("Registration failed");
        }
    };

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

    // Keydown event handler to handle "Enter" key press for next button
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (step === 0) {
                handleFirstNext(e);
            } else if (step === 1) {
                handleSecondNext(e);
            } else if (step === 2) {
                handleThirdNext(e);
            } else if (step === 3) {
                handleSubmit(e);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        {step === 0 && (
            <>
                <div className={styles.doubleRow}>
                    <div className={styles.input}>
                    <label>First Name</label>
                    <input type="text" value={fname} placeholder="John" onChange={(e) => setFname(e.target.value)} required />
                    <p className={styles.error}>{fnameError}</p>
                    </div>
                    <div className={styles.input}>
                    <label>Last Name</label>
                    <input type="text" value={sname} placeholder="Doe" onChange={(e) => setSname(e.target.value)} required />
                    <p className={styles.error}>{snameError}</p>
                    </div>
                </div>
                <div className={styles.input}>
                    <label>Email</label>
                    <input type="email" value={email} placeholder="john.doe@example.com" onChange={(e) => setEmail(e.target.value)} required />
                    <p className={styles.error}>{emailError}</p>
                </div>
                <div className={styles.input}>
                    <label>Date of Birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                    <p>You must be at least 16 years old to use GoFetch.</p>
                    <p className={styles.error}>{dobError}</p>
                </div>
                <div className={styles.registerFormButtons}>
                    <button onClick={handleFirstNext} className={`btn btn-primary ${styles.registerFormButton}`}>
                    Next<ArrowRight size={18} strokeWidth={2} />
                    </button>
                </div>
            </>
        )}
        {step === 1 && (
            <>
                <div className={styles.input}>
                    <label>Street Address</label>
                    <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="123 Main St" required />
                </div>
                <div className={styles.input}>
                    <label>City</label>
                    <input type="text" value={city} placeholder="London" onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className={styles.input}>
                    <label>Postcode</label>
                    <input type="text" value={postcode} placeholder="SW1A 1AA" onChange={(e) => setPostcode(e.target.value)} required />
                </div>
                <div className={styles.input}>
                    <label>Country</label>
                    <input type="text" value={country} placeholder="United Kingdom" onChange={(e) => setCountry(e.target.value)} required />
                </div>
                <p className={styles.error}>{addressError}</p>
                <div className={styles.registerFormButtons}>
                    <button onClick={() => onStepChange(0)} className={`btn btn-secondary ${styles.registerFormButton}`}>
                    <ArrowLeft size={18} strokeWidth={2} />Back
                    </button>
                    <button onClick={handleSecondNext} className={`btn btn-primary ${styles.registerFormButton}`}>
                    Next<ArrowRight size={18} strokeWidth={2} />
                    </button>
                </div>
            </>
        )}
        {step === 2 && (
            <>
                <div className={styles.input}>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <p className={styles.error}>{passwordError}</p>
                </div>
                <div className={styles.input}>
                    <label>Confirm Password</label>
                    <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} required />
                    <p className={styles.error}>{password2Error}</p>
                </div>
                <div className={styles.input}>
                    <label>Account Type</label>
                    <div className={styles.radioGroup}>
                    <label>
                        <input type="radio" name="role" value={Role.OWNER} checked={role === Role.OWNER} onChange={() => setRole(Role.OWNER)} required />
                        <span>Pet Owner</span>
                    </label>
                    <label>
                        <input type="radio" name="role" value={Role.MINDER} checked={role === Role.MINDER} onChange={() => setRole(Role.MINDER)} required />
                        <span>Pet Minder</span>
                    </label>
                    </div>
                    <p>Select whether you want to find pet minders or offer pet minding services.</p>
                </div>
                <div className={styles.registerFormButtons}>
                    <button onClick={() => onStepChange(1)} className={`btn btn-secondary ${styles.registerFormButton}`}>
                    <ArrowLeft size={18} strokeWidth={2} />Back
                    </button>
                    <button onClick={handleThirdNext} className={`btn btn-primary ${styles.registerFormButton}`}>
                    Next<ArrowRight size={18} strokeWidth={2} />
                    </button>
                </div>
            </>
        )}
        {step === 3 && (
            <div className={styles.profilePicture}>
                <p style={{marginBottom: "10px"}}>Upload a profile picture to help others recognise you.</p>
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
                <p className={styles.error}>{profilePictureError}</p>
                <div className={styles.registerFormButtons}>
                    <button onClick={() => onStepChange(2)} className={`btn btn-secondary ${styles.registerFormButton}`}>
                        <ArrowLeft size={18} strokeWidth={2} />Back
                    </button>
                    <button type="submit" className={`btn btn-primary ${styles.registerFormButton}`}>
                        <Check size={18} strokeWidth={2} />Create Account
                    </button>                    
                </div>
            </div>
        )}
        </form>
    );
}

export default RegisterForm;
