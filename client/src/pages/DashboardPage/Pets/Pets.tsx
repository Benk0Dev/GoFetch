import { useAuth } from "../../../context/AuthContext";
import dashboardStyles from "../DashboardPage.module.css";
import Pet from "./Pet";
import styles from "./Pets.module.css";
import { PawPrint } from "lucide-react";
import "../../../global.css";

function Pets() {
    const { user } = useAuth();

    return (
        <div className={`${dashboardStyles.dashboardSection} ${styles.pets}`}>
            <h2>Your Pets</h2>
            <p>Manage your pets' profiles and add new pets.</p>
            <div className={styles.petList}>
                {user.ownerRoleInfo.pets.map((pet: any) => {
                    return (
                        <Pet key={pet.id} pet={pet} />
                    );
                })}
                <div className={styles.addPet}>
                    <PawPrint className={styles.addPetIcon} size={64} />
                    <h3>Add a New Pet</h3>
                    <p>Add another pet to your profile to book services for them.</p>
                    <button className="btn2 btn-primary" onClick={() => {}}>Add New Pet</button>
                </div>
            </div>
        </div>
    );
}

export default Pets;
