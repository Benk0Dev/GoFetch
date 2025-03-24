import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import styles from "./Services.module.css";
import dashboardStyles from "../Dashboard.module.css";
import { IService, INewService } from "../../../models/IService";
import { Clock, PoundSterling, SquarePen, Trash2, Plus } from "lucide-react";
import NewService from "./NewService";

function Services() {
    const { user, setUser } = useAuth();
    const [services, setServices] = useState<IService[]>(user.minderRoleInfo.services);
    const [showNewService, setShowNewService] = useState(false);

    // const addService = () => {
    //     const updated = [
    //         ...services,
    //         {
    //             id: Date.now(),
    //             type: "New Service",
    //             price: 0,
    //             availability: "Flexible"
    //         }
    //     ];
    //     setServices(updated);

    //     // Update global user context with new services
    //     setUser({
    //         ...user,
    //         minderRoleInfo: {
    //             ...user.minderRoleInfo,
    //             services: updated
    //         }
    //     });
    // };

    const addService = () => {
        setShowNewService(true);
    }

    const editService = (id: number) => {

    }

    const deleteService = (id: number) => {

    }

    const handleAdd = (service: INewService) => {
        
    }

    const handleCancel = () => {
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
                {services.map((service) => (
                    <div key={service.id} className={styles.servicesTableRow}>
                        <div className={styles.columnData}>{service.type}</div>
                        <div className={styles.columnData}><Clock size={16} strokeWidth={2.25} />{service.duration}</div>
                        <div className={styles.columnData}><PoundSterling size={16} strokeWidth={2.25} />{service.price}</div>
                        <div className={styles.actions}>
                            <button className="btn-link" onClick={() => editService(service.id)}>
                                <SquarePen size={16} strokeWidth={2.25} />
                            </button>
                            <button className="btn-link" onClick={() => deleteService(service.id)}>
                                <Trash2 size={16} strokeWidth={2.25} />
                            </button>
                        </div>
                    </div>
                ))}

            </div>
            {!showNewService && <button className={`btn btn-primary ${styles.addService}`} onClick={() => addService()}><Plus size={18} strokeWidth={2.25} />Add New Service</button>}
            {showNewService && <NewService onCancel={handleCancel} onAdd={handleAdd} />}
        </div>
    );
}

export default Services;
