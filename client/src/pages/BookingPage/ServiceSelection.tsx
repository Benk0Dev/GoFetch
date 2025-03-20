import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./BookingPage.module.css";

interface IService {
  id: number;
  type: string;
  duration: number;
  price: number;
}

interface ServiceSelectionProps {
  selectedServiceId: number | null;
  onServiceChange: (serviceId: number) => void;
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({ selectedServiceId, onServiceChange }) => {
  const [services, setServices] = useState<IService[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onServiceChange(parseInt(e.target.value));
  };

  const selectedService = services.find(service => service.id === selectedServiceId);

  return (
    <div className={styles.formGroup}>
      <label htmlFor="serviceSelect">Select Service</label>
      <select id="serviceSelect" onChange={handleServiceChange}>
        <option value="">Select a service</option>
        {services.map(service => (
          <option key={service.id} value={service.id}>{service.type}</option>
        ))}
      </select>
      {selectedService && (
        <div className={styles.serviceDetails}>
          <p><strong>Duration:</strong> {selectedService.duration} minutes</p>
          <p><strong>Price:</strong> £{selectedService.price}</p>
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;