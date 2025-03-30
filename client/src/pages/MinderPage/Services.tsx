import styles from "./MinderPage.module.css";
import { Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Role } from "@gofetch/models/IUser";
import { IService } from "@gofetch/models/IService";

function Services({ minder, onBooking }: { minder: any, onBooking: (service: IService) => void }) {
    const { user } = useAuth();

    return (
        <div className={styles.sectionContainer}>
            <div className={styles.subSectionContainer}>
                <h4>Services Offered</h4>
                <p>Details about the pet minding services provided.</p>
                <div className={styles.servicesContainer}>
                    {minder.minderRoleInfo?.services?.length > 0 ? (
                        minder.minderRoleInfo.services.map((service: any, index: number) => (
                            <div key={index} className={styles.service}>
                                <div className={styles.serviceHeader}>
                                    <h6>{service.type.replace(/_/g, " ")}</h6>
                                    <span className={styles.servicePrice}>
                                        £{service.price}
                                    </span>
                                </div>
                                <p className={styles.serviceDuration}>
                                    <Clock size={16} />
                                    {service.duration}
                                </p>
                                {user && user.currentRole === Role.OWNER && user.id !== minder.id && (
                                    <button
                                    className="btn btn-primary"
                                    onClick={() => onBooking(service)}
                                    >
                                        Book This Service
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>This minder has not added any services yet.</p>
                    )}
                </div>

            </div>
        </div>
    );

}

export default Services;
