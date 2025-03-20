import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IUserDetails } from "../../utils/StorageManager";
import styles from "./BookingPage.module.css";
import ServiceSelection from "./ServiceSelection";
import PetProfileSelection from "./PetProfileSelection";
import PetMinderSummary from "./PetMinderSummary";

interface PetMinder {
  userDetails: IUserDetails;
  primaryUserInfo: {
    profilePic: string;
    verified: boolean;
  };
  minderRoleInfo: {
      serviceIDs: number[];
      price: string;
      rating: number;
      availability: string;
      bio: string;
  };
}

const BookingPage: React.FC = () => {
  const { userId, petMinderId } = useParams<{ userId: string; petMinderId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [petMinder, setPetMinder] = useState<PetMinder | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchPetMinder = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/minders/${petMinderId}`);
        setPetMinder(response.data);
      } catch (error) {
        console.error("Error fetching pet minder:", error);
      }
    };

    fetchUser();
    fetchPetMinder();
  }, [userId, petMinderId]);

  if (!user || !petMinder) {
    return <p>User or Pet Minder not found.</p>;
  }

  const handleAddPetProfile = () => {
    navigate("/add-pet-profile");
  };

  const handleSubmit = () => {
    if (!selectedServiceId) {
      alert("Please select a service.");
      return;
    }
    if (!selectedPetId) {
      alert("Please select a pet profile.");
      return;
    }
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
    if (!selectedTime) {
      alert("Please select a time.");
      return;
    }
    if (!instructions) {
      alert("Please enter instructions for the minder.");
      return;
    }

    // Check if the selected date and time are within the pet minder's availability
    const availability = petMinder.minderRoleInfo.availability;
    const [startTime, endTime] = availability.split(" - ");
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const startDateTime = new Date(`${selectedDate}T${startTime}`);
    const endDateTime = new Date(`${selectedDate}T${endTime}`);

    if (selectedDateTime < startDateTime || selectedDateTime > endDateTime) {
      alert("The pet minder is not available at the selected time.");
      return;
    }

    // Submit the form
    console.log("Form submitted");
  };

  return (
    <div className={styles.bookingPage}>
      <div className={styles.formContainer}>
        <h2>Book a Service</h2>

        <ServiceSelection selectedServiceId={selectedServiceId} onServiceChange={setSelectedServiceId}/>

        <PetProfileSelection userId={userId ? parseInt(userId) : 0} selectedPetId={selectedPetId} onPetChange={setSelectedPetId} onAddPetProfile={handleAddPetProfile}/>

        <div className={styles.formGroup}>
          <label htmlFor="dateSelect">Select Date</label>
          <input type="date" id="dateSelect" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="timeSelect">Select Time</label>
          <input type="time" id="timeSelect" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="instructions">Please enter instructions for the minder</label>
          <textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
        </div>

        <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
      </div>

      <div className={styles.summaryContainer}>
        <PetMinderSummary petMinderId={petMinderId ? parseInt(petMinderId) : 0} minder={petMinder} />
      </div>
    </div>
  );
};

export default BookingPage;