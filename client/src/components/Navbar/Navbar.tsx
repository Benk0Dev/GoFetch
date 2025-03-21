import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import "../../global.css";
import ProfileIcon from "./ProfileIcon";
import NotificationIcon from "./NotificationIcon";
import logo from "../../assets/images/logo.svg";
import { Mail } from "lucide-react";
import { getUserId, getUserRole } from "../../utils/StorageManager";
import { getUserById, logout } from "../../services/Registry";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  useEffect(() => {
    const updateUser = async () => {
      const id = getUserId();
      if (id) {
        const fetchedUser = await getUserById(id);
        setUser(fetchedUser);
      }
      setLoading(false);
      setForceUpdate((prev) => prev + 1);
    };

    updateUser();
    window.addEventListener("userUpdate", updateUser);
    return () => window.removeEventListener("userUpdate", updateUser);
  }, []);

  let homeLink = getUserRole() ? "/dashboard" : "/";

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

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
          ) : getUserRole() ? (
            <>
              <Link to="/browse" className="btn-link">
                Explore Minders
              </Link>
              <NotificationIcon />
              <Link to="/messages" className="btn-round btn-transparent">
                <Mail strokeWidth={2.25} />
              </Link>
              <ProfileIcon key={forceUpdate} user={user} onLogout={handleLogout} />
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
