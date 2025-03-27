import styles from "./Pets.module.css";
import "../../../global.css";
import { IPet } from "../../../models/IPet";
import { useNavigate } from "react-router-dom";
import { removePetForUser } from "../../../services/Registry";
import { useAuth } from "../../../context/AuthContext";

function Pet({ pet }: { pet: IPet }) {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    const getAge = (dob: Date): number => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();

        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    };

    const handleRemove = async () => {
        const removed = await removePetForUser(pet.id);
        if (removed) {
            refreshUser();
        } else {
            console.error("Failed to remove pet");
        }
    };

    return (
        <div className={styles.pet}>
            <h3>{pet.name}</h3>
            <p>{pet.breed}, {getAge(pet.dob)} years</p>
            <img src={(pet.picture)} alt={pet.name} />
            <div className={styles.buttons}>
                <button className="btn btn-primary" onClick={() => navigate(pet.id.toString())}>View Details</button>
                <button className="btn btn-secondary" onClick={handleRemove}>Remove</button>
            </div>
        </div>
    );
}

export default Pet;
