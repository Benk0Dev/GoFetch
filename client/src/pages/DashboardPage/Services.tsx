import { useState } from "react";
import styles from "./Services.module.css";
import dashboardStyles from "./DashboardPage.module.css";

interface Service {
    id: number;
    type: string;
    price: number;
    availability: string;
}

function Services() {
    const [services, setServices] = useState<Service[]>([
        { id: 1, type: "Dog Walking", price: 15, availability: "Weekdays 9AM - 6PM" },
        { id: 2, type: "Pet Sitting", price: 25, availability: "Weekends 8AM - 8PM" }
    ]);

    const addService = () => {
        setServices([...services, { id: Date.now(), type: "New Service", price: 0, availability: "Flexible" }]);
    };

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
