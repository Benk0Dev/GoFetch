import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import "../../global.css";
import { logout, getCurrentUserType, getAllCurrentUserDetails } from "../../services/AuthService";
import { IUserDetails } from "../../utils/StorageManager";
import { Role } from "../../models/User";
import ProfileIcon from "./ProfileIcon/ProfileIcon";

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
        <Link to={homeLink}><h2>GoFetch</h2></Link>
        <div className={styles.navLinks}>
          {userType ? (
            <>
              <Link to="/browse" className="btn btn-transparent">Browse</Link>
              <Link to="/dashboard" className="btn btn-transparent">Dashboard</Link>
              <Link to="/notifications" className="btn btn-transparent"><i className="fa-regular fa-bell"></i></Link>
              <Link to="/messages" className="btn btn-transparent"><i className="fa-regular fa-envelope"></i></Link>
              <ProfileIcon key={forceUpdate} userType={userType} userDetails={userDetails} onLogout={handleLogout} />
            </>
          ) : (
            !["/login", "/register"].includes(location.pathname) && (
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
