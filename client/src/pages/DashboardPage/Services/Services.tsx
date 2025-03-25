import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Services.module.css";
import dashboardStyles from "../Dashboard.module.css";
import { IService, INewService } from "../../../models/IService";
import { Clock, PoundSterling, Trash2, Plus } from "lucide-react";
import NewService from "./NewService";
import { addService, deleteService, getUserByIdWithPictures } from "../../../services/Registry";

function Services() {
    const { user, setUser } = useAuth();
    const [showNewService, setShowNewService] = useState(false);

    const deleteUserService = async (id: number) => {
        const deleted = await deleteService(id);
        if (deleted) {
            const updatedUser = await getUserByIdWithPictures(user.userDetails.id);
            if (!updatedUser) {
                console.error("Error updating user");
                return;
            }
            setUser(updatedUser);
        } else {
            console.error("Error deleting service");
        }
    }

    const handleAdd = async (service: INewService) => {
        const added = await addService(user.userDetails.id, service);
        if (added) {
            const updatedUser = await getUserByIdWithPictures(user.userDetails.id);
            if (!updatedUser) {
                console.error("Error updating user");
                return;
            }
            setUser(updatedUser);
        } else {
            console.error("Error adding service");
        }
        setShowNewService(false);
    }

    return (
        <div className={`${dashboardStyles.dashboardSection}`}>
            <h2>Your Services</h2>
            <p>Manage the services you offer to pet owners.</p>
            <div className={styles.servicesTable}>
                <div className={styles.servicesTableHeader}>
                    <div>Service Type</div>
                    <div>Duration</div>
                    <div>Price</div>
                    <div>Actions</div>
                </div>
                {user.minderRoleInfo.services.map((service: IService) => (
                    <div key={service.id} className={styles.servicesTableRow}>
                        <div className={styles.columnData}>{service.type}</div>
                        <div className={styles.columnData}><Clock size={16} strokeWidth={2.25} />{service.duration}</div>
                        <div className={styles.columnData}><PoundSterling size={16} strokeWidth={2.25} />{service.price}</div>
                        <button className={`btn-link ${styles.deleteButton}`} onClick={() => deleteUserService(service.id)}>
                            <Trash2 size={16} strokeWidth={2.25} />
                        </button>
                    </div>
                ))}

            </div>
            {!showNewService && <button className={`btn btn-primary ${styles.addService}`} onClick={() => setShowNewService(true)}><Plus size={18} strokeWidth={2.25} />Add New Service</button>}
            {showNewService && <NewService onCancel={() => setShowNewService(false)} onAdd={handleAdd} />}
        </div>
    );
}

export default Services;
