import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Availability } from "@gofetch/models/IUser";
import { IPet } from "@gofetch/models/IPet";
import { IService } from "@gofetch/models/IService";
import PetSelector from "@client/pages/BookingPage/PetSelector";
import ServiceSelector from "@client/pages/BookingPage/ServiceSelector";
import styles from "@client/pages/BookingPage/BookingPage.module.css";
import MinderCard from "@client/pages/BookingPage/MinderCard";
import { useAuth } from "@client/context/AuthContext";
import BackButton from "@client/components/BackButton";

const BookingPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const minder = location.state?.minder;
  const service = location.state?.service;
  const pet = location.state?.pet;
  const date = location.state?.date;
  const time = location.state?.time;
  const notes = location.state?.notes;

  const [selectedService, setSelectedService] = useState<IService>(service);
  const [selectedPet, setSelectedPet] = useState<IPet | null>(pet ? pet : user.ownerRoleInfo.pets.length > 0 ? user.ownerRoleInfo.pets[0] : null);
  const [selectedDate, setSelectedDate] = useState(date ? date : "");
  const [selectedTime, setSelectedTime] = useState(time ? time : "");
  const [specialInstructions, setSpecialInstructions] = useState(notes ? notes : "");
  const [error, setError] = useState("");

  const handleBooking = () => {
    setError("");

    const selctedDateAndTime = new Date(`${selectedDate}T${selectedTime}`);
    
    if (!selectedDate || !selectedTime || !selectedPet || !selectedService || !specialInstructions) {
      setError("Please fill out all fields.");
      return;
    }

    if (selctedDateAndTime < new Date()) {
      setError("Selected date and time cannot be in the past.");
      return;
    }

    const selectedDay = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const availability = minder.minderRoleInfo.availability;
    const isAvailable =
      availability === Availability.FLEXIBLE ||
      (availability === Availability.WEEKDAYS && ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(selectedDay)) ||
      (availability === Availability.WEEKENDS && ["Saturday", "Sunday"].includes(selectedDay));

    if (!isAvailable) {
      setError(`${minder.name.fname} is not available on ${selectedDay}.`);
      return;
    }

    setError("");
    navigate("/booking/payment", {
      state: {
        owner: user,
        minder,
        service: selectedService,
        selectedDate,
        selectedTime,
        pet: selectedPet,
        specialInstructions,
      }, replace: true
    });
  };

  if (!minder) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`container ${styles.bookingPage}`}>
      <BackButton />
      <div className={styles.bookingPageContainer}>
        <MinderCard minder={minder} />
        <div className={styles.bookingForm}>
          <div>
            <h3>Booking Details</h3>
            <p>Select the service, pet, date and time for your booking.</p>
          </div>
          <ServiceSelector services={minder.minderRoleInfo.services} selectedService={selectedService} setSelectedService={setSelectedService} />
          <PetSelector selectedPet={selectedPet} setSelectedPet={setSelectedPet} />
          <div className={styles.timers}>
            <div>
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label>Time</label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.specialInstructions}>
            <label>Special Instructions</label>
            <textarea
              placeholder="Provide any specific instructions for the pet minder, such as feeding schedules, walking routes, or special needs..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className={styles.textarea}
            />
            <p className={styles.error}>{error}</p>
          </div>
          <button onClick={handleBooking} disabled={false} className="btn btn-primary">
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
