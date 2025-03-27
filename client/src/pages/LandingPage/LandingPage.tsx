import { Link } from "react-router-dom";
import { Search, Calendar, MessageCircle } from "lucide-react";
import styles from "@client/pages/LandingPage/LandingPage.module.css";
import "@client/global.css";
import hero from "@client/assets/images/hero.jpg";
import { useAuth } from "@client/context/AuthContext";
import { Role } from "@gofetch/models/IUser";

function LandingPage() {
  const { role } = useAuth();

  return (
    <>
      <div className="container">
        <div className={styles.hero}>
          <div className={styles.textContainer}>
            <h1>Find Trusted Pet Minders Near You</h1>
            <p>Book a reliable pet minder or earn money by caring for pets.</p>
            <Link to="/browse" className="btn2 btn-primary">Explore Minders</Link>
          </div>
          <div className={styles.imageContainer}>
            <img src={hero} alt="Hero" />
          </div>
        </div>
      </div>

      <div className={styles.background}>
        <div className="container">
          <div className={styles.howItWorks}>
            <h2>How GoFetch Works</h2>
            <p>Our platform makes it easy to find and book trusted pet minders in your area.</p>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.icon}>
                  <Search size={24} strokeWidth={2.5} />
                </div>
                <h4>Search</h4>
                <p>Find trusted pet minders based on reviews and availability.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.icon}>
                  <Calendar size={24} strokeWidth={2.5} />
                </div>
                <h4>Book</h4>
                <p>Schedule services with your preferred pet minder and provide specific care instructions.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.icon}>
                  <MessageCircle size={24} strokeWidth={2.5} />
                </div>
                <h4>Connect</h4>
                <p>Communicate directly with pet minders, receive updates, and track your pet's activities.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <div className="container">
        <div className={styles.loginRegister}>
        <h2>Ready to Get Started?</h2>
        <p>Join GoFetch today and connect with trusted pet minders in your area.</p>
        <div className={styles.buttons}>
          {role === Role.ADMIN ? (
            <>
              <button className="btn btn-secondary" disabled={true}>Login</button>
              <button className="btn btn-primary" disabled={true}>Sign Up</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
        </div>
      </div>
    </>

  );
}

export default LandingPage;
