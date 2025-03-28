import React from "react";
import { Clock } from "lucide-react";
import { IService } from "@gofetch/models/IService";
import styles from "@client/pages/BookingPage/ServiceSelector.module.css";

interface ServiceSelectorProps {
  services: IService[];
  selectedService: IService;
  setSelectedService: (service: IService) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ services, selectedService, setSelectedService }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Select a Service</h2>
      <div className={styles.serviceGrid}>
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className={`${styles.serviceCard} ${selectedService.id === service.id ? styles.selected : ""}`}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.serviceTitle}>{service.type}</h3>
              <p className={styles.servicePrice}>£{service.price}</p>
            </div>
            <p className={styles.duration}><Clock className={styles.clockIcon} /> {service.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;