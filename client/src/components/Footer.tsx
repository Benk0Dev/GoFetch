import styles from "@client/components/Footer.module.css";
import "@client/global.css";

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
