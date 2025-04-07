import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BookingPage.module.css";

const SuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const minderName = location.state?.minderName || "the minder";
  const bookingId = location.state?.bookingId;

  if (!minderName || !bookingId) {
    navigate("/browse", { replace: true });
    return null;
  }

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <div className={styles.successPage}>
        <h2>Booking Successful</h2>
        <p>Your booking has successfully been made with {minderName}.</p>
        <p>They will respond to your request when they're ready.</p>
        <div className={styles.buttons}>
          <button onClick={() => navigate(`/dashboard/bookings/${bookingId}`, { replace: true })} className="btn btn-primary">
            View Booking
          </button>
          <button onClick={() => navigate("/browse", { replace: true })} className="btn btn-secondary">
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;