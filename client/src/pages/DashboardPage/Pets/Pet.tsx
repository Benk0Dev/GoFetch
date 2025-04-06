import { useNavigate } from "react-router-dom";
import styles from "@client/pages/DashboardPage/Pets/Pets.module.css";
import "@client/global.css";
import { IPet } from "@gofetch/models/IPet";
import { removePetForUser } from "@client/services/PetRegistry";
import { useAuth } from "@client/context/AuthContext";

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
                <button className="btn btn-primary" onClick={() => navigate(`/pets/${pet.id.toString()}`)}>View Details</button>
                <button className="btn btn-secondary" onClick={handleRemove}>Remove</button>
            </div>
        </div>
    );
}

export default Pet;
