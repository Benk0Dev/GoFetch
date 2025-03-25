import { useState } from "react";
import styles from "./AddPet.module.css";
import formStyles from "../../AuthenticationPage/AuthenticationPage.module.css";
import BackButton from "../../../components/BackButton";
import { EGender, ESize } from "../../../models/IPet";
import { PawPrint } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { addPetForUser, getUserByIdWithPictures, uploadImage } from "../../../services/Registry";
import { useNavigate } from "react-router-dom";

function capitalizeWords(str: string): string {
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

function AddPet() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState<EGender>(EGender.MALE);
    const [breed, setBreed] = useState("");
    const [size, setSize] = useState<ESize>(ESize.SMALL);
    const [neutered, setNeutered] = useState(false);
    const [behaviour, setBehaviour] = useState("");
    const [allergies, setAllergies] = useState("");
    const [picture, setPicture] = useState<string>("");
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (/\d/.test(name) || /\d/.test(breed)) {
            setError("Name and breed cannot contain numbers.");
            return;
        }

        if (dob > new Date().toISOString().split("T")[0]) {
            setError("Date of birth cannot be in the future.");
            return;
        }

        let filename: string | undefined;

        if (pendingFile) {
            filename = await uploadImage(pendingFile);
            if (!filename) {
                setError("Failed to upload image.");
                return;
            }
        }

        const newPet = {
            name: capitalizeWords(name),
            dob: new Date(dob),
            gender,
            breed: capitalizeWords(breed),
            size,
            neutered,
            behaviour: behaviour || undefined,
            allergies: allergies || undefined,
            picture: filename || undefined,
        };

        console.log("Submitting new pet:", newPet);
        const petAdded = await addPetForUser(user.userDetails.id, newPet);
        if (petAdded) {
            const updatedUser = await getUserByIdWithPictures(user.userDetails.id);
            if (updatedUser) {
                setUser(updatedUser);
                navigate(-1);
            } else {
                console.error("Failed to update user after adding pet.");
            }
            console.log("Pet added successfully!");
        } else {
            console.error("Failed to add pet.");
        }
    };

    const handleAddPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewURL = URL.createObjectURL(file);
            setPicture(previewURL);
            setPendingFile(file);
        }
    };

    const getPhoto = () => {
        if (picture) {
        return (
            <div className={styles.photo}>
            <img src={picture} alt={name} />
            </div>
        );
        } else {
        return (
            <div className={styles.photo}>
            <PawPrint size={64} />
            </div>
        );
        }
    };

    return (
        <div className={`container ${styles.addPet}`}>
        <div className={styles.addPetContainer}>
            <BackButton />
            <form className={styles.addPetContent} onSubmit={handleSubmit}>
                <h2>Add Your Pet</h2>
                <div className={formStyles.doubleRow}>
                    <div className={formStyles.input}>
                        <label>Name</label>
                        <input type="text" value={name} placeholder="Buddy" onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className={formStyles.input}>
                        <label>Breed</label>
                        <input type="text" value={breed} placeholder="Labrador Retriever" onChange={(e) => setBreed(e.target.value)} required />
                    </div>
                </div>
                <div className={formStyles.input}>
                    <label>Pet Photo</label>
                    <div className={styles.photoContainer}>
                        {getPhoto()}
                        <input type="file" accept="image/*" onChange={handleAddPicture} />
                    </div>
                    <p>Upload a photo of your pet.</p>
                </div>
                <div className={formStyles.doubleRow}>
                    <div className={formStyles.input}>
                        <label>Date of Birth</label>
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                    </div>
                    <div className={formStyles.input}>
                        <label>Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value as EGender)} required>
                            <option value={EGender.MALE}>Male</option>
                            <option value={EGender.FEMALE}>Female</option>
                        </select>
                    </div>
                </div>
                <div className={formStyles.input}>
                    <label>Is your pet neutered/sprayed?</label>
                    <div className={formStyles.radioGroup} style={{flexDirection: "row",
        alignItems: "center", columnGap: "20px"}}>
                        <label>
                            <input
                                type="radio"
                                name="neutered"
                                value="yes"
                                checked={neutered === true}
                                onChange={() => setNeutered(true)}
                            />
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="neutered"
                                value="no"
                                checked={neutered === false}
                                onChange={() => setNeutered(false)}
                            />
                            No
                        </label>
                    </div>
                </div>
                <div className={formStyles.input}>
                    <label>Size</label>
                    <select value={size} onChange={(e) => setSize(e.target.value as ESize)} required>
                        <option value={ESize.SMALL}>{ESize.SMALL}</option>
                        <option value={ESize.MEDIUM}>{ESize.MEDIUM}</option>
                        <option value={ESize.LARGE}>{ESize.LARGE}</option>
                    </select>
                </div>
                <div className={formStyles.input}>
                    <label>Behaviour</label>
                    <textarea value={behaviour} placeholder="Describe your pet's behaviour, temperament, and any special needs..." onChange={(e) => setBehaviour(e.target.value)} />
                    <p>Include details about how your pet interacts with other animals and people.</p>
                </div>
                <div className={formStyles.input}>
                    <label>Allergies</label>
                    <textarea value={allergies} placeholder="List any allergies or dietary restrictions your pet has..." onChange={(e) => setAllergies(e.target.value)} />
                </div>
                <p className={formStyles.error} style={{textAlign: "center", marginBottom: "10px"}}>{error}</p>
                <button type="submit" className="btn btn-primary" style={{width: "100%"}}>Add Pet</button>
            </form>
        </div>
        </div>
    );
}

export default AddPet;
