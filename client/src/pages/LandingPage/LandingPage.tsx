import Hero from "./Hero";
import HowItWorks from "./HowItWorks";
import LoginRegister from "./LoginRegister";

function LandingPage() {
  const loggedIn = false;
  let components: any = [];
  
  if (!loggedIn) {
    components = [
    <Hero key="hero" />,
    <HowItWorks key="howItWorks" />,
    <LoginRegister key="loginRegister" />
  ];
  }

  return (
    <div>
      {components}
    </div>
  );
}

export default LandingPage;
