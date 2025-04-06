import React from "react";
import { Clock } from "lucide-react";
import { IService } from "@gofetch/models/IService";
import styles from "@client/pages/BookingPage/BookingPage.module.css";

interface ServiceSelectorProps {
  services: IService[];
  selectedService: IService;
  setSelectedService: (service: IService) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ services, selectedService, setSelectedService }) => {
  return (
    <div className={styles.servicesContainer}>
      <label>Select a Service</label>
      <div className={styles.services}>
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service)}
            className={`${styles.serviceCard} ${selectedService.id === service.id ? styles.selected : ""}`}
          >
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelector;