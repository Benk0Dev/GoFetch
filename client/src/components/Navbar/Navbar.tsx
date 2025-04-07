import { useLocation, Link } from "react-router-dom";
import { Mail } from "lucide-react";
import styles from "@client/components/Navbar/Navbar.module.css";
import ProfileIcon from "@client/components/Navbar/ProfileIcon";
import NotificationIcon from "@client/components/Navbar/NotificationIcon";
import logo from "@client/assets/images/logo.svg";
import { useAuth } from "@client/context/AuthContext";
import { Role } from "@gofetch/models/IUser";
import { LogOut } from "lucide-react";

function Navbar() {
  const { role, loading, user, logout } = useAuth();
  const location = useLocation();
  const isSuspended = user?.primaryUserInfo.suspension;

  const homeLink = isSuspended ? "/" : role === Role.OWNER || role === Role.MINDER ? "/dashboard" : "/";

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
          ) : isSuspended ? (
            <>
              <button className="btn btn-transparent" onClick={logout} style={{ padding: "10px 16px", lineHeight: "1.6" }}>
                <LogOut size={16} style={{color: "inherit"}} />Logout
              </button>
            </>
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
