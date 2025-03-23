import React, { useEffect, useState, useRef } from "react";
import { IBooking, EBookingStatus } from "../../models/IBooking";
import { IPet } from "../../models/IPet";
import { IUser } from "../../models/IUser";
import { IService } from "../../models/IService";

// Assuming you have a POST function in your service file
import { createBooking } from "../../services/booking/BookingService";

interface IBookSubmitProps {
  pet: IPet;
  minder: IUser;
  owner: IUser;
  service: IService;
  startDate: string;
  endDate: string;
  notes: string;
}

const BookSubmit: React.FC<IBookSubmitProps> = ({
  pet,
  minder,
  owner,
  service,
  startDate,
  endDate,
  notes,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (hasSubmitted.current) return; // Prevent duplicate submission
    hasSubmitted.current = true;
    // Trigger the booking submission after the component mounts
    const submitBooking = async () => {
      try {
        setIsSubmitting(true);

        // Create booking data object
        const bookingData: IBooking = {
            id: 0, // Dummy ID (you can replace with logic to generate a real ID)
            petId: pet.id,
            minderId: minder.userDetails.id,
            ownerId: owner.userDetails.id,
            serviceId: service.id,
            startDate,
            endDate,
            notes,
            price: service.price,
            status: EBookingStatus.Pending, // Dummy status (you can use an enum or string)
            createdAt: new Date(), // Current timestamp for createdAt
            updatedAt: new Date() // Current timestamp for updatedAt
          };

        // Send the booking data via POST request
        const response = await createBooking(bookingData);

        if (response.success) {
          setSuccessMessage("Booking was successfully created!");
        } else {
          setError("An error occurred while creating your booking.");
        }
      } catch (error) {
        setError("An error occurred while creating your booking.");
      } finally {
        setIsSubmitting(false);
      }
    };

    submitBooking();
  }, [pet, minder, owner, service, startDate, endDate, notes]);

  return (
    <div>
      {isSubmitting && <p>Submitting your booking...</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default BookSubmit;