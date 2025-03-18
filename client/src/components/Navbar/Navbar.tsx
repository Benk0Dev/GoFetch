import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import "../../global.css";
import { logout, getCurrentUserType, getAllCurrentUserDetails } from "../../services/AuthService";
import { IUserDetails } from "../../utils/StorageManager";
import { Role } from "../../models/User";
import ProfileIcon from "./ProfileIcon";
import NotificationIcon from "./NotificationIcon";
import logo from "../../assets/images/logo.svg";
import { Mail } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userType, setUserType] = useState<Role | null>(getCurrentUserType());
  const [userDetails, setUserDetails] = useState<IUserDetails | null>(getAllCurrentUserDetails());

  const [forceUpdate, setForceUpdate] = useState<number>(0);

  useEffect(() => {
    const updateUser = () => {
      // Update when event fires
      setUserType(getCurrentUserType()); 
      setUserDetails(getAllCurrentUserDetails());
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener("userUpdate", updateUser); // Listen for user changes
    return () => window.removeEventListener("userUpdate", updateUser); // Cleanup
  }, []);

  let homeLink = userType ? "/dashboard" : "/";

  const handleLogout = () => {
    logout();
    setUserType(null);
    setUserDetails(null);
    navigate("/");
  };

  return (
    <nav className={styles.navbar} id="navbar">
      <div className="container flex" style={{ padding: "10px 20px"}}>
        <Link className={styles.logo} to={homeLink}><img src={logo}></img><h2>GoFetch</h2></Link>
        <div className={styles.navLinks}>
          {userType ? (
            <>
              <Link to="/browse" className="btn-link">Explore Minders</Link>
              <NotificationIcon />
              <Link to="/messages" className="btn-round btn-transparent"><Mail strokeWidth={2.25} /></Link>
              <ProfileIcon key={forceUpdate} userType={userType} userDetails={userDetails} onLogout={handleLogout} />
            </>
          ) : (
            !["/login", "/register-owner", "/register-minder"].includes(location.pathname) && (
              <>
                <Link to="/login" className="btn btn-transparent">Login</Link>
                <Link to="/register" className="btn btn-background">Sign Up</Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
