import { Link } from "react-router-dom";
import pageStyles from './LandingPage.module.css';

function LoginRegister() {
  return (
    <section className={`${pageStyles.landingPageSection} ${pageStyles.LoginRegister}`}>
      <div className={pageStyles.container}>
        <h2>Get Started</h2>
        <p>Login or register to find pet minders near you.</p>
        <div className={pageStyles.buttons}>
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </section>
  );
}

export default LoginRegister;
