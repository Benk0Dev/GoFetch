import { useLocation, Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import "../../global.css";
import ProfileIcon from "./ProfileIcon";
import NotificationIcon from "./NotificationIcon";
import logo from "../../assets/images/logo.svg";
import { Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Role } from "../../models/IUser";

function Navbar() {
  const { role, loading } = useAuth();
  const location = useLocation();

  const homeLink = role === Role.OWNER || role === Role.MINDER ? "/dashboard" : "/";

  return (
    <nav className={styles.navbar} id="navbar">
      <div className="container flex" style={{ padding: "10px 20px" }}>
        <Link className={styles.logo} to={homeLink}>
          <img src={logo} alt="GoFetch Logo" />
          <h2>GoFetch</h2>
        </Link>

        <div className={styles.navLinks}>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : role ? (
            <>
              <Link to="/browse" className="btn-link" style={{ marginRight: "10px" }}>Explore Minders</Link>
              <NotificationIcon />
              <Link to="/chats" className="btn-round btn-transparent" style={{padding: "10px"}}>
                <Mail strokeWidth={2.25} />
              </Link>
              <ProfileIcon />
            </>
          ) : !["/login", "/register"].includes(location.pathname) ? (
            <>
              <Link to="/login" className="btn btn-transparent">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
