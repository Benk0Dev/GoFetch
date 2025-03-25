import styles from "./Pets.module.css";
import "../../../global.css";

function Pet({ pet }: { pet: any }) {
    const [picture, setPicture] = useState(true);

    const getAge = (dob: string): number => {
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
            <img src={(`/images/dog_images/${pet.picture}`)} alt={pet.name} />
            <div className={styles.buttons}>
                <button className="btn" onClick={() => {}}>View Details</button>
                <button className="btn" onClick={() => {}}>Edit</button>
            </div>
        </div>
    );
}

export default Pet;
