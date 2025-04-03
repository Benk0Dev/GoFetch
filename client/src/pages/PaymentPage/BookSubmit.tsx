import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { INewBooking } from "@gofetch/models/IBooking";
import { IPayment, ICardDetails } from "@gofetch/models/IPayment.ts";
import { IPet } from "@gofetch/models/IPet";
import { IUser } from "@gofetch/models/IUser";
import { IService } from "@gofetch/models/IService";

import { createBooking } from "@client/services/BookingRegistry";
import { createPayment } from "@client/services/PaymentRegistry";

interface IBookSubmitProps {
  pet: IPet;
  minder: IUser;
  owner: IUser;
  service: IService;
  time: Date;
  notes: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const BookSubmit: React.FC<IBookSubmitProps> = ({
  pet,
  minder,
  owner,
  service,
  time,
  notes,
  cardNumber,
  expiryDate,
  cvv,
  cardName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const hasSubmitted = useRef(false);

  const formatExpirationDate = (expirationDate: string): string => {
    const [year, month] = expirationDate.split("-");
    return `${month}/${year.slice(2)}`;
  };

  useEffect(() => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    const submitBooking = async () => {
      try {
        setIsSubmitting(true);

        const bookingData: INewBooking = {
          petId: pet.id,
          minderId: minder.id,
          ownerId: owner.id,
          serviceId: service.id,
          time,
          notes,
        };

        const response = await createBooking(bookingData);

        const cardDetails: ICardDetails = {
          cardNumber,
          expiryDate: formatExpirationDate(expiryDate),
          cvv,
          cardName,
        };

        const paymentDetails: Omit<IPayment, "id" | "status" | "createdAt" | "updatedAt"> = {
          amount: service.price,
          bookingId: response.bookingId, // Ensure correct property from API response
          cardDetails,
        };

        const secondResponse = await createPayment(paymentDetails);

        if (response.success && secondResponse.success) {
          navigate("/success", { state: { minderName: minder.name.fname}});
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
  }, [pet, minder, owner, service, time, notes, cardNumber, expiryDate, cvv, cardName, navigate]);

  return (
    <div>
      {isSubmitting && <p>Submitting your booking...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default BookSubmit;