import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import "../../global.css";
import { getCurrentUserID, logout } from "../../services/AuthService";
import { fetchUser } from "../../services/Registry";
import User from "../../models/User";
import ProfileIcon from "./ProfileIcon/ProfileIcon";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userID = getCurrentUserID();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (userID) {
      fetchUser(userID).then(setUser);
    } 
  }, [userID]); // Runs when userID changes

  let homeLink = userID ? "/dashboard" : "/";

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className={styles.navbar} id="navbar">
      <div className="container flex" style={{ padding: "10px 20px"}}>
        <Link to={homeLink}><h2>GoFetch</h2></Link>

        <div className={styles.navLinks}>
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-transparent">Dashboard</Link>
              <ProfileIcon user={user} onLogout={handleLogout} />
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
