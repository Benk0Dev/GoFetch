import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import "../global.css";

function Navbar() {
  return (
    <nav className={styles.navbar} id="navbar">
      <div className="container flex">
      <Link to="/"><h2>GoFetch</h2></Link>
        <div className={styles.navLinks}>
          <Link to="/login" className={"btn btn-transparent"}>Login</Link>
          <Link to="/register" className={"btn btn-background"}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
