import { useNavigate } from "react-router-dom";
import styles from "@client/pages/AuthenticationPage/AuthenticationPage.module.css";
import RegisterForm from "@client/pages/AuthenticationPage/RegisterForm";
import BackButton from "@client/components/BackButton";
import { useState } from "react";

function RegisterPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const steps = ["Personal Information", "Address Information", "Account and Role", "Profile Picture"];

    const handleStepChange = (step: number) => {
        setStep(step);
        if (step > steps.length - 1) {
            navigate("/dashboard", { replace: true });
        }
    }

    return (
        <div className={`container ${styles.authentication}`}>
            <div className={styles.authenticationContainer}>
                <BackButton text="Back to previous page" />
                <div className={`${styles.authenticationBox} ${styles.register}`}>
                    <h2 style={{marginBottom: "10px"}}>Create an Account</h2>
                    <div className={styles.progressBar}>
                        <div className={styles.progressBarText}>
                            <span className={styles.stepText}>Step {step + 1} of {steps.length}</span>
                            <span>{steps[step]}</span>
                        </div>
                        <div className={styles.progressBarBackground}>
                            <div className={styles.progressBarFill} style={{ width: `${(step + 1) * ((1 / steps.length) * 100)}%` }}></div>
                        </div>
                    </div>
                    <RegisterForm step={step} onStepChange={handleStepChange} />
                    <p>Already have an account? <button onClick={() => navigate("/login")} className={styles.alternateLink}>Login</button></p>

                    {/* {accountSetupStep >= 0 && (
                        <>
                            <h2 style={{marginBottom: "0"}}>{accountSetupSteps[accountSetupStep]}</h2>
                            <p style={{margin: "5px 0 10px"}}>{accountSetupStepsDescriptions[accountSetupStep]}</p>
                            <div className={styles.progressBar}>
                                <div className={styles.progressBarText}>
                                    <span className={styles.stepText}>Step {accountSetupStep + 1} of {accountSetupSteps.length}</span>
                                    <span>{accountSetupSteps[accountSetupStep]}</span>
                                </div>
                                <div className={styles.progressBarBackground}>
                                    <div className={styles.progressBarFill} style={{ width: `${(accountSetupStep + 1) * ((1 / accountSetupSteps.length) * 100)}%` }}></div>
                                </div>
                            </div>
                            <AccountSetup step={accountSetupStep} onStepChange={handleAccountSetupStepChange} steps={accountSetupSteps} />
                        </>
                    )} */}
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
