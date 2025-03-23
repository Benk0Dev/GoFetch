import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Services.module.css";
import dashboardStyles from "./DashboardPage.module.css";

interface Service {
    id: number;
    type: string;
    price: number;
    availability: string;
}

function Services() {
    const { user, setUser } = useAuth();
    const [services, setServices] = useState<Service[]>([]);

    useEffect(() => {
        // Load from user object if available
        if (user?.minderRoleInfo?.services) {
            setServices(user.minderRoleInfo.services);
        } else {
            // Fallback/mock if not populated yet
            setServices([
                { id: 1, type: "Dog Walking", price: 15, availability: "Weekdays 9AM - 6PM" },
                { id: 2, type: "Pet Sitting", price: 25, availability: "Weekends 8AM - 8PM" }
            ]);
        }
    }, [user]);

    const addService = () => {
        const updated = [
            ...services,
            {
                id: Date.now(),
                type: "New Service",
                price: 0,
                availability: "Flexible"
            }
        ];
        setServices(updated);

        // Update global user context with new services
        setUser({
            ...user,
            minderRoleInfo: {
                ...user.minderRoleInfo,
                services: updated
            }
        });
    };

    if (!user) return null;

    return (
        <div className={`${dashboardStyles.dashboardSection} ${styles.services}`}>
            <h2>Manage Services</h2>
            <button onClick={addService}>Add New Service</button>
            <ul>
                {services.map((service) => (
                    <li key={service.id}>
                        {service.type} - ${service.price} <span>({service.availability})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Services;
