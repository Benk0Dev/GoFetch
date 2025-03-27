import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserById } from "@client/services/Registry";
import { Availability, IUser } from "@gofetch/models/IUser";
import { IPet } from "@gofetch/models/IPet";
import { IService } from "@gofetch/models/IService";
import PetSelector from "@client/pages/BookingPage/PetSelector";
import ServiceSelector from "@client/pages/BookingPage/ServiceSelector";
import styles from "@client/pages/BookingPage/BookingPage.module.css";
import MinderCard from "@client/pages/BookingPage/MinderCard";
import BookSubmit from "@client/pages/BookingPage/BookSubmit"; // Import the BookSubmit component
import { useAuth } from "@client/context/AuthContext";

const BookingPage: React.FC = () => {
  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const minderId = location.state?.minderId;

  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [minder, setMinder] = useState<IUser | null>(null);
  const [selectedPet, setSelectedPet] = useState<IPet | null>(user.ownerRoleInfo.pets[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

  useEffect(() => {
    const fetchMinder = async () => {
      try {
        const fetchedMinder = await getUserById(minderId);
        if (fetchedMinder) {
          setMinder(fetchedMinder);
          if (fetchedMinder.minderRoleInfo.services.length > 0) {
            setSelectedService(fetchedMinder.minderRoleInfo.services[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch minder:", error);
      }
    };

    if (minderId) fetchMinder();
  }, [minderId]);

  const handleBooking = () => {
    if (!selectedPet || !selectedService || !selectedDate || !selectedTime || !specialInstructions) {
      alert("Please fill out all fields before booking.");
      return;
    }

    if (!minder) return;

    setIsProcessing(true);
    const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
    const availability = minder.minderRoleInfo.availability;
    const isAvailable =
      availability === Availability.FLEXIBLE ||
      (availability === Availability.WEEKDAYS &&
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(selectedDay)) ||
      (availability === Availability.WEEKENDS && ["Saturday", "Sunday"].includes(selectedDay));

    setTimeout(() => {
      if (!isAvailable) {
        alert(`Sorry, ${minder.name.fname} is not available on ${selectedDay}.`);
      } else {
        // Set the submission state and show the BookSubmit component
        setIsSubmitted(true);
        // After showing the BookSubmit component, navigate to the Dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // Wait for BookSubmit component to be displayed before navigating
      }
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="container">
      <div className={styles.leftContent}>
        <div className={styles.section}>
          <h1 className={styles.heading}>
            Book a service with {minder?.name.fname || "your pet minder"}
          </h1>

          {minder?.minderRoleInfo.services && (
            <ServiceSelector
              services={minder?.minderRoleInfo.services}
              selectedService={selectedService || minder?.minderRoleInfo.services[0]}
              setSelectedService={setSelectedService}
            />
          )}
        </div>

        <div className={styles.section}>
          <PetSelector selectedPet={selectedPet} setSelectedPet={setSelectedPet} />
        </div>

        <div className={styles.section}>
          <div className={styles.timers}>
            <div>
              <label className={styles.label}>Select a Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.input}
              />
            </div>

            <div>
              <label className={styles.label}>Select a Time:</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <label className={styles.label}>Special Instructions:</label>
          <textarea
            placeholder="Enter in information that would be useful to the Pet Minder. This can include interest of the dog, or specific routes."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className={styles.textarea}
          />

          <button
            onClick={handleBooking}
            disabled={isProcessing}
            className={styles.bookButton}
          >
            {isProcessing ? "Processing ..." : "Book Session"}
          </button>
        </div>
      </div>

      <div className={styles.minderCardSection}>
        <MinderCard minderId={minderId} />
      </div>

      {isSubmitted && selectedPet && minder && (
        <BookSubmit
          pet={selectedPet}
          minder={minder as IUser}
          owner={user as IUser}
          service={selectedService as IService}
          time={new Date(`${selectedDate} ${selectedTime}`)}
          notes={specialInstructions}
        />
      )}
    </div>
  );
};

export default BookingPage;