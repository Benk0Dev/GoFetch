import pageStyles from './LandingPage.module.css';

function HowItWorks() {
  return (
    <section className={pageStyles.landingPageSection}>
      <div className="container">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Sign Up</h3>
            <p>Create an account.</p>
          </div>
          <div className="step">
            <h3>2. Browse</h3>
            <p>Find trusted pet minders based on reviews and availability.</p>
          </div>
          <div className="step">
            <h3>3. Book & Connect</h3>
            <p>Send messages and finalise your booking.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
