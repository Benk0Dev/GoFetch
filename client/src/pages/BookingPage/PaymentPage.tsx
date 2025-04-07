import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./BookingPage.module.css";
import { INewBooking } from "@gofetch/models/IBooking.ts";
import { createBooking } from "@client/services/BookingRegistry.ts";
import { ICardDetails, IPayment } from "@gofetch/models/IPayment.ts";
import { createPayment } from "@client/services/PaymentRegistry.ts";
import { createNotification } from "@client/services/NotificationRegistry";
import { NotificationType } from "@gofetch/models/INotification";
import { useAuth } from "@client/context/AuthContext";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();

  const owner = location.state?.owner || {};
  const minder = location.state?.minder || {};
  const service = location.state?.service || {};
  const selectedDate = location.state?.selectedDate || "";
  const selectedTime = location.state?.selectedTime || "";
  const pet = location.state?.pet || {};
  const specialInstructions = location.state?.specialInstructions || "";

  const [cardDetails, setCardDetails] = useState({
    name: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  const [error, setError] = useState("");
  useEffect(() => {
    if (!owner || !minder || !service || !selectedDate || !selectedTime) {
      navigate("/browse", { replace: true });
    }
  }, [owner, minder, service, selectedDate, selectedTime, navigate]);

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  
    if (/^\d{0,2}\/?\d{0,2}$/.test(value)) {
      let formattedValue = value;
      if (!value.includes("/")) {
        formattedValue = value.replace(/(\d{2})(\d{0,2})/, "$1/$2");
      }
      
      if (formattedValue.length > 5) {
        formattedValue = formattedValue.slice(0, 5);
      }

      setCardDetails({ ...cardDetails, expirationDate: formattedValue });
    }
  };

  const validateCardDetails = () => {
    setError("");
    if (!cardDetails.cardNumber || !cardDetails.expirationDate || !cardDetails.cvv || !cardDetails.name) {
      setError("Please fill out all fields.");
      return false;
    }
    if (!/^[0-9]{16}$/.test(cardDetails.cardNumber)) {
      setError("Card number must be 16 digits.");
      return false;
    }
    const expirationDateParts = cardDetails.expirationDate.split("/");
    if (expirationDateParts.length !== 2) {
      setError("Invalid expiration date format.");
      return false;
    }
    if (expirationDateParts.some(part => part.length !== 2)) {
      setError("Invalid expiration date format.");
      return false;
    }
    const month = parseInt(expirationDateParts[0], 10);
    const year = parseInt(expirationDateParts[1], 10);
    if ((month < 1 || month > 12) || (year < 0 || year > 99)) {
      setError("Invalid expiration date.");
      return false;
    }
    const currentDate = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(currentDate.getFullYear() + 20);
    const fullYear = year + (year < 50 ? 2000 : 1900);
    const expirationDate = new Date(fullYear, month - 1, 1);
    if (expirationDate <= currentDate) {
      setError("Expiration date must be in the future.");
      return false;
    }
    if (expirationDate > maxFutureDate) {
      setError("Expiration date cannot be more than 20 years in the future.");
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      setError("Security code must be 3 digits.");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(cardDetails.name)) {
      setError("Cardholder name must contain only letters and spaces.");
      return false;
    }
    if (cardDetails.name.length < 3) {
      setError("Cardholder name must be at least 3 characters long.");
      return false;
    }
    if (cardDetails.name.length > 50) {
      setError("Cardholder name must be less than 50 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCardDetails()) {
      return;
    }

    const bookingData: INewBooking = {
      petId: pet.id,
      minderId: minder.id,
      ownerId: owner.id,
      serviceId: service.id,
      time: new Date(`${selectedDate}T${selectedTime}`),
      notes: specialInstructions,
    };

    const newBooking = await createBooking(bookingData);

    if (!newBooking) {
      setError("An error occurred while creating your booking.");
      return;
    }

    const newCardDetails: ICardDetails = {
      cardNumber: cardDetails.cardNumber,
      expiryDate: cardDetails.expirationDate,
      cvv: cardDetails.cvv,
      cardName: cardDetails.name,
    };

    const paymentDetails: Omit<IPayment, "id" | "status" | "createdAt" | "updatedAt"> = {
      amount: service.price,
      bookingId: newBooking.id,
      cardDetails: newCardDetails,
    };

    const newPayment = await createPayment(paymentDetails);

    if (!newPayment) {
      setError("An error occurred while processing your payment.");
      return;
    }

    await createNotification({
      userId: minder.id,
      message: `You have a new booking request.`,
      type: NotificationType.Booking,
      linkId: newBooking.id,
    });

    refreshUser();

    navigate("/booking/success", { state: { minderName: minder.name.fname, bookingId: newBooking.id }, replace: true });
  };

  return (
    <div className={"container " + styles.paymentPage}>
      <div className={styles.paymentPageContainer}>
        <div>
          <h2>Payment</h2>
          <p>Complete your payment to confirm your booking.</p>
        </div>
        <div className={styles.paymentSectionContainer}>
          <h4 style={{marginBottom: "10px"}}>Booking Summary</h4>
          <p><strong>Service Type:</strong> {service.type}</p>
          <p><strong>Duration:</strong> {service.duration}</p>
          <p><strong>Price:</strong> £{service?.price}</p>
          <p><strong>Pet:</strong> {pet.name} ({pet.breed})</p>
          <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString("en-GB")}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
          <p><strong>Special Instructions:</strong> {specialInstructions}</p>
          <button 
            className="btn btn-secondary" 
            style={{marginTop: "20px"}} 
            onClick={() => navigate("/booking", { state: {
              minder,
              service,
              pet,
              date: selectedDate,
              time: selectedTime,
              notes: specialInstructions,
            }, replace: true })}
          >
            Edit Booking
          </button>
        </div>
        <div className={styles.paymentSectionContainer}>
        <h4>Payment Details</h4>
        <p style={{marginBottom: "20px"}}>Enter your card information to complete the payment.</p>
        <form className={styles.paymentForm}>
          <div className={styles.formInput}>
            <label>Cardholder Name</label>
            <input
              type="text"
              name="name"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div className={styles.formInput}>
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value.replace(/\s+/g, "") })}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              required
            />
          </div>
          <div className={styles.doubleRow}>
            <div className={styles.formInput}>
              <label>Expiration Date</label>
              <input
                  type="text"
                  name="expirationDate"
                  value={cardDetails.expirationDate}
                  onChange={handleExpirationChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
            </div>
            <div className={styles.formInput}>
              <label>Security Code</label>
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                placeholder="123"
                maxLength={3}
                required
              />
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="button" className="btn btn-primary" onClick={handleSubmit} style={{width: "100%"}}>
            Pay £{service.price}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;