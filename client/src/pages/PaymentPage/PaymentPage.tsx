import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BookSubmit from "./BookSubmit.tsx";
import { IUser } from "@gofetch/models/IUser";
import { IService } from "@gofetch/models/IService";
import styles from "./PaymentPage.module.css";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const labelMap: { [key: string]: string } = {
    name: "Cardholder Name",
    cardNumber: "Card Number",
    expirationDate: "Expiration Date",
    cvv: "Security Code",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "cardNumber" && value.length > 16) return;
    if (name === "cvv" && value.length > 3) return;

    if (name === "expirationMonth" || name === "expirationYear") {
      const month = (document.querySelector('select[name="expirationMonth"]') as HTMLSelectElement)?.value;
      const year = (document.querySelector('select[name="expirationYear"]') as HTMLSelectElement)?.value;
      const expirationDate = `${year}-${month.padStart(2, "0")}-01`;
      setCardDetails({ ...cardDetails, expirationDate });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const validateCardDetails = () => {
    const newErrors: { [key: string]: string } = {};

    if (!cardDetails.name) newErrors.name = "Cardholder name is required";
    if (!/^[0-9]{16}$/.test(cardDetails.cardNumber)) newErrors.cardNumber = "Card number must be 16 digits";
    const expirationDate = new Date(cardDetails.expirationDate + "-01");
    const currentDate = new Date();
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 20);
    if (expirationDate <= currentDate) newErrors.expirationDate = "Expiration date must be in the future";
    if (expirationDate > maxFutureDate) newErrors.expirationDate = "Expiration date cannot be more than 20 years in the future";
    if (!/^[0-9]{3}$/.test(cardDetails.cvv)) newErrors.cvv = "Security code must be 3 digits";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateCardDetails()) {
      console.log("Payment successful, proceeding with booking...");
      setSubmitted(true);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Checkout</h1>
      <div className={styles.detailsBox}>
        <p><strong>Service:</strong> {service?.type} ({service?.duration} min, ${service?.price})</p>
        <p><strong>Date:</strong> {selectedDate}</p>
        <p><strong>Time:</strong> {selectedTime}</p>
        <p><strong>Pet:</strong> {pet?.name}</p>
        <p><strong>Instructions:</strong> {specialInstructions}</p>
      </div>
      <button
        className={styles.editButton}
        onClick={() => navigate("/booking", { state: { minderId: minder.id, service: (minder.minderRoleInfo.services ?? [])[0] } })}
      >
        Edit Booking Details
      </button>

      <h2 className={styles.subHeading}>Payment Details</h2>
      <div className={styles.paymentForm}>
        {Object.entries(cardDetails).map(([key, value]) => (
          <div key={key} className={styles.inputGroup}>
            <label>{labelMap[key]}:</label>
            {key === "expirationDate" ? (
              <div className={styles.dateContainer}>
                <select name="expirationMonth" value={cardDetails.expirationDate.slice(5, 7)} onChange={handleInputChange}>
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                      {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                    </option>
                  ))}
                </select>
                <select name="expirationYear" value={cardDetails.expirationDate.slice(0, 4)} onChange={handleInputChange}>
                  <option value="">Year</option>
                  {Array.from({ length: 20 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>
            ) : (
              <input
                type={key === "cardNumber" ? "text" : "text"}
                name={key}
                value={value}
                onChange={handleInputChange}
                placeholder={key === "Cardholder Name" ? "Enter the name exactly as it is on your card" : key === "cardNumber" ? "Please do not add spaces" : key === "cvv" ? "The CVV on the back of your card" : ""}
              />
            )}
            {errors[key] && <p className={styles.errorText}>{errors[key]}</p>}
          </div>
        ))}
      </div>
      <button className={styles.bookButton} onClick={handleSubmit}>Confirm Payment</button>

      {submitted && (
        <BookSubmit
          pet={pet}
          minder={minder as IUser}
          owner={owner as IUser}
          service={service as IService}
          time={new Date(`${selectedDate}T${selectedTime}`)}
          notes={specialInstructions}
          cardNumber={cardDetails.cardNumber}
          expiryDate={cardDetails.expirationDate}
          cvv={cardDetails.cvv}
          cardName={cardDetails.name}
        />
      )}
    </div>
  );
};

export default CheckoutPage;