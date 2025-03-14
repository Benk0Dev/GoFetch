import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/AuthService";
import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import LoginRegister from "./LoginRegister";


function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, []);

  return (
    
    <div>
      <Hero key="hero" />,
      <HowItWorks key="howItWorks" />,
      <LoginRegister key="loginRegister" />
    </div>
  );
}

export default LandingPage;
