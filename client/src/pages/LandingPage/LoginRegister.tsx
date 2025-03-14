import { Link } from "react-router-dom";
import pageStyles from './LandingPage.module.css';

function LoginRegister() {
  return (
    <section className={pageStyles.landingPageSection}>
      <div className="container">
        <h2>Get Started</h2>
        <p>Login or register to find pet minders near you.</p>
        <div>
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-secondary">Sign Up</Link>
        </div>
      </div>
    </section>
  );
}

export default LoginRegister;
