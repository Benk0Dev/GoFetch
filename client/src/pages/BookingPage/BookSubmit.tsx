import React, { useEffect, useState, useRef } from "react";
import { INewBooking } from "@gofetch/models/IBooking";
import { IPet } from "@gofetch/models/IPet";
import { IUser } from "@gofetch/models/IUser";
import { IService } from "@gofetch/models/IService";

// Assuming you have a POST function in your service file
import { createBooking } from "@client/services/BookingRegistry";

interface IBookSubmitProps {
  pet: IPet;
  minder: IUser;
  owner: IUser;
  service: IService;
  time: Date;
  notes: string;
}

const BookSubmit: React.FC<IBookSubmitProps> = ({
  pet,
  minder,
  owner,
  service,
  time,
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
        const bookingData: INewBooking = {
            petId: pet.id,
            minderId: minder.id,
            ownerId: owner.id,
            serviceId: service.id,
            time,
            notes,
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
  }, [pet, minder, owner, service, time, notes]);

  return (
    <div>
      {isSubmitting && <p>Submitting your booking...</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default BookSubmit;