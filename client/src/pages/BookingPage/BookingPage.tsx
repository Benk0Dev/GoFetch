import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserId } from "../../utils/StorageManager";
import { getUserById } from "../../services/Registry";
import { IUser } from "../../models/IUser";
import { IPet } from "../../models/IPet";
import { IService } from "../../models/IService";
import PetSelector from "./PetSelector";
import ServiceSelector from "./ServiceSelector";
import styles from "./BookingPage.module.css";
import MinderCard from "./MinderCard";

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const minderId = location.state?.minderId;

  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const userId = Number(getUserId());
  const [user, setUser] = useState<IUser | null>(null);
  const [minder, setMinder] = useState<IUser | null>(null);
  const [selectedPet, setSelectedPet] = useState<IPet | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserById(userId);
        if (fetchedUser) {
          setUser(fetchedUser);
          if (fetchedUser.ownerRoleInfo?.pets?.length > 0) {
            setSelectedPet(fetchedUser.ownerRoleInfo.pets[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    const fetchMinder = async () => {
      try {
        const fetchedMinder = await getUserById(minderId);
        if (fetchedMinder) {
          setMinder(fetchedMinder);
          if (fetchedMinder.minderRoleInfo?.services?.length > 0) {
            setSelectedService(fetchedMinder.minderRoleInfo.services[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch minder:", error);
      }
    };

    if (userId) fetchUser();
    if (minderId) fetchMinder();
  }, [userId, minderId]);

  const handleBooking = () => {
    if (!selectedPet) {
      alert("Please select a pet before booking.");
      return;
    }

    if (!minder) return;

    setIsProcessing(true);
    const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" });
    const availability = minder.minderRoleInfo?.availability;
    const isAvailable =
      availability === "Flexible" ||
      (availability === "Weekdays" &&
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(selectedDay)) ||
      (availability === "Weekends" && ["Saturday", "Sunday"].includes(selectedDay));

    setTimeout(() => {
      if (!isAvailable) {
        alert(`Sorry, ${minder.userDetails?.fname} is not available on ${selectedDay}.`);
      } else {
        // Navigate to dashboard on success
        alert(`Booking was successful.`);
        navigate("/dashboard");
      }
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftContent}>
        <div className={styles.section}>
          <h1 className={styles.heading}>
            Book a service with {minder?.userDetails?.fname || "your pet minder"}
          </h1>

          {minder?.minderRoleInfo?.services && (
            <ServiceSelector
              services={minder.minderRoleInfo.services}
              selectedService={selectedService || minder.minderRoleInfo.services[0]}
              setSelectedService={setSelectedService}
            />
          )}
        </div>

        <div className={styles.section}>
          <PetSelector user={user} selectedPet={selectedPet} setSelectedPet={setSelectedPet} />
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
    </div>
  );
};

export default BookingPage;