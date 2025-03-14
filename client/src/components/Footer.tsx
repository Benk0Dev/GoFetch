import styles from "./Footer.module.css";
import "../global.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>&copy; {new Date().getFullYear()} GoFetch. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
