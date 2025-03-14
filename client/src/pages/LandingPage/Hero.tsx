import styles from './Hero.module.css';
import '../../global.css';
import pageStyles from './LandingPage.module.css';
import { Link } from "react-router-dom";


function Hero() {
  const navBarHeight: number = document.getElementById('navbar')?.offsetHeight || 0;

  return (
    <section className={`${styles.hero} ${pageStyles.landingPageSection}`} style={{ height: `calc(100vh - ${navBarHeight}px)` }}>
      <div className="container">
        <h1>Find Trusted Pet Minders Near You</h1>
        <p>Book a reliable pet minder or earn money by caring for pets.</p>
        <Link to="/browse" className="btn btn-primary">Explore Minders</Link>
      </div>
    </section>
  );
}

export default Hero;
