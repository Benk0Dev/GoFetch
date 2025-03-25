import styles from "./Pets.module.css";
import "../../../global.css";
import { IPet } from "../../../models/IPet";
import { useNavigate } from "react-router-dom";

function Pet({ pet }: { pet: IPet }) {
    const navigate = useNavigate();

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

    return (
        <div className={styles.pet}>
            <h3>{pet.name}</h3>
            <p>{pet.breed}, {getAge(pet.dob)} years</p>
            <img src={(pet.picture)} alt={pet.name} />
            <button className="btn btn-secondary" onClick={() => navigate(pet.id.toString())}>View Details</button>
        </div>
    );
}

export default Pet;
