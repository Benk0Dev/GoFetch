import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import LoginRegister from "./LoginRegister";

function LandingPage() {
  return (
    <div>
      <Hero key="hero" />,
      <HowItWorks key="howItWorks" />,
      <LoginRegister key="loginRegister" />
    </div>
  );
}

export default LandingPage;
