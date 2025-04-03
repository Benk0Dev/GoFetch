import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserById } from "@client/services/UserRegistry";
import { Availability, IUser } from "@gofetch/models/IUser";
import { IPet } from "@gofetch/models/IPet";
import { IService } from "@gofetch/models/IService";
import PetSelector from "@client/pages/BookingPage/PetSelector";
import ServiceSelector from "@client/pages/BookingPage/ServiceSelector";
import styles from "@client/pages/BookingPage/BookingPage.module.css";
import MinderCard from "@client/pages/BookingPage/MinderCard";
import { useAuth } from "@client/context/AuthContext";

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const minderId = location.state?.minderId;
  const service = location.state?.service;

  const [selectedService, setSelectedService] = useState<IService>(service);
  const [minder, setMinder] = useState<IUser | null>(null);
  const [selectedPet, setSelectedPet] = useState<IPet | null>(user.ownerRoleInfo.pets[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchMinder = async () => {
      try {
        const fetchedMinder = await getUserById(minderId);
        if (fetchedMinder) {
          setMinder(fetchedMinder);
        }
      } catch (error) {
        console.error("Failed to fetch minder:", error);
      }
    };

    if (minderId) fetchMinder();
  }, [minderId]);

  useEffect(() => {
    if (isSubmitted && selectedPet && minder) {
      navigate("/payment", {
        state: {
          owner: user,
          minder,
          service: selectedService,
          selectedDate,
          selectedTime,
          pet: selectedPet,
          specialInstructions,
        },
      });
    }
  }, [isSubmitted, navigate, selectedPet, minder, selectedService, selectedDate, selectedTime, specialInstructions, user]);

  const handleBooking = () => {
    let newErrors: { [key: string]: string } = {};
    const today = new Date().toISOString().split("T")[0];
    
    if (!selectedDate) {
      newErrors.selectedDate = "Please fill out the date field.";
    } else if (selectedDate < today) {
      newErrors.selectedDate = "Selected date cannot be in the past.";
    }

    if (!selectedPet) newErrors.selectedPet = "Please select a pet.";
    if (!selectedService) newErrors.selectedService = "Please select a service.";
    if (!selectedTime) newErrors.selectedTime = "Please select a time.";
    if (!specialInstructions) newErrors.specialInstructions = "Please enter special instructions.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!minder) return;

    setIsProcessing(true);
    const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });
    const availability = minder.minderRoleInfo.availability;
    const isAvailable =
      availability === Availability.FLEXIBLE ||
      (availability === Availability.WEEKDAYS && ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(selectedDay)) ||
      (availability === Availability.WEEKENDS && ["Saturday", "Sunday"].includes(selectedDay));

    setTimeout(() => {
      if (!isAvailable) {
        setErrors({ availability: `Sorry, ${minder.name.fname} is not available on ${selectedDay}.` });
      } else {
        setIsSubmitted(true);
      }
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="container">
      <div className={styles.leftContent}>
        <div className={styles.section}>
          <h1 className={styles.heading}>Book a service with {minder?.name.fname || "your pet minder"}</h1>

          {minder?.minderRoleInfo.services && (
            <ServiceSelector services={minder.minderRoleInfo.services} selectedService={selectedService || minder.minderRoleInfo.services[0]} setSelectedService={setSelectedService} />
          )}
        </div>

        <div className={styles.section}>
          <PetSelector selectedPet={selectedPet} setSelectedPet={setSelectedPet} />
          {errors.selectedPet && <p className={styles.errorText}>{errors.selectedPet}</p>}
        </div>

        <div className={styles.section}>
          <div className={styles.timers}>
            <div>
              <label className={styles.label}>Select a Date:</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className={styles.input} />
              {errors.selectedDate && <p className={styles.errorText}>{errors.selectedDate}</p>}
            </div>

            <div>
              <label className={styles.label}>Select a Time:</label>
              <input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} className={styles.input} />
              {errors.selectedTime && <p className={styles.errorText}>{errors.selectedTime}</p>}
            </div>
          </div>

          <label className={styles.label}>Special Instructions:</label>
          <textarea placeholder="Enter in information that would be useful to the Pet Minder." value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} className={styles.textarea} />
          {errors.specialInstructions && <p className={styles.errorText}>{errors.specialInstructions}</p>}

          <button onClick={handleBooking} disabled={isProcessing} className={styles.bookButton}>
            {isProcessing ? "Processing ..." : "Book Session"}
          </button>
          {errors.availability && <p className={styles.errorText}>{errors.availability}</p>}
        </div>
      </div>
      <div className={styles.minderCardSection}>
        <MinderCard minderId={minderId} />
      </div>
    </div>
  );
};

export default BookingPage;
