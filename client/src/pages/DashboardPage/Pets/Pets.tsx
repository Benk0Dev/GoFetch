import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { useAuth } from "@client/context/AuthContext";
import dashboardStyles from "@client/pages/DashboardPage/Dashboard.module.css";
import Pet from "@client/pages/DashboardPage/Pets/Pet";
import styles from "@client/pages/DashboardPage/Pets/Pets.module.css";
import "@client/global.css";

function Pets() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddPet = () => {
        navigate("/add-pet");
    }

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
                    <button className="btn btn-primary" onClick={handleAddPet}>Add New Pet</button>
                </div>
            </div>
        </div>
    );
}

export default Pets;
