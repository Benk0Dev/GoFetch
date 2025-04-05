import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "@client/pages/SettingsPage/SettingsPage.module.css";
import { useAuth } from "@client/context/AuthContext";
import { deleteUser, editUser } from "@client/services/UserRegistry";
import BackButton from "@client/components/BackButton";
import Switch from "react-switch";

function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangePassswordError, setShowChangePasswordError] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Temporary - will need to add settings to backend
  const [notificationsEnabled, setNotificationsEnabled] = useState(localStorage.getItem("notificationsEnabled") === "true" || localStorage.getItem("notificationsEnabled") === null);
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem("soundEnabled") === "true" || localStorage.getItem("soundEnabled") === null);

  useEffect(() => {
    if (!showDeleteModal) return;
    const preventScroll = (e: Event) => e.preventDefault();

    const preventKeys = (e: KeyboardEvent) => {
        const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", " "];
        if (keys.includes(e.key)) e.preventDefault();
    };

    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("keydown", preventKeys);

    return () => {
        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventScroll);
        document.removeEventListener("keydown", preventKeys);
    };
  }, [showDeleteModal]);

  const handleChangePassword = () => {
  // Logic to change password
  if (!user) return;
  const newPasswordInput = document.querySelector(`input[type="password"]`) as HTMLInputElement;
  const confirmPasswordInput = document.querySelectorAll(`input[type="password"]`)[1] as HTMLInputElement;
  
  if (!newPasswordInput || !confirmPasswordInput) {
    console.error("Password inputs not found");
    setShowChangePasswordError(true);
    return;
  }
  
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  
  if (!newPassword || !confirmPassword) {
    console.error("Please fill in both password fields");
    setShowChangePasswordError(true);
    return;
  }
  
  if (newPassword !== confirmPassword) {
    console.error("Passwords do not match");
    setShowChangePasswordError(true);
    return;
  }
  
  editUser(user.id, { loginDetails: { password: newPassword } })
    .then(() => {
      setShowChangePasswordModal(false);
      setShowChangePasswordError(false);
    })
    .catch((error: unknown) => {
      console.error("Error changing password:", error);
      setShowChangePasswordError(true);
    });
  console.log("Password changed");
  setShowChangePasswordModal(false);
};

  const handleNotificationToggle = () => {
    setNotificationsEnabled(prev => !prev);
    console.log("Notifications toggled", !notificationsEnabled);
    localStorage.setItem("notificationsEnabled", JSON.stringify(!notificationsEnabled));
  }

  const handleSoundToggle = () => {
    setSoundEnabled(prev => !prev);
    console.log("Sound toggled", !soundEnabled);
    localStorage.setItem("soundEnabled", JSON.stringify(!soundEnabled));
  }

  const handleDeleteAccount = () => {
    deleteUser(user.id);
    logout();
    setShowDeleteModal(false);
    navigate("/");
    console.log("Account deleted");
  };

  return (
    <div className={"container" + " " + styles.settingsPage}>
      <BackButton />
      <div className={styles.settings}>
        <h2>Settings</h2>
        <div className={styles.settingsContent}>
          <div className={styles.settingsSection}>
            <h5>Account</h5>
            <button className="btn btn-primary" onClick={() => setShowChangePasswordModal(true)}>Change Password</button>
          </div>
          <div className={styles.settingsSection}>
            <h5>Notifications</h5>
            <div className={styles.notificationSetting}>
              <p>Notfication Alerts</p>
              <Switch 
                onChange={handleNotificationToggle} 
                checked={notificationsEnabled} 
                offColor="#b5b5b5" 
                onColor="#ff8800"
                uncheckedIcon={false}
                checkedIcon={false}
                height={20}
                width={40}
                activeBoxShadow="none"
                className={styles.toggleSwitch}
              />
            </div>
            <div className={styles.notificationSetting}>
              <p>Notification Sound</p>
              <Switch 
                onChange={handleSoundToggle} 
                checked={soundEnabled} 
                offColor="#b5b5b5" 
                onColor="#ff8800"
                uncheckedIcon={false}
                checkedIcon={false}
                height={20}
                width={40}
                activeBoxShadow="none"
                className={styles.toggleSwitch}
              />
            </div>
          </div>
          <div className={styles.settingsSection}>
            <div className={styles.dangerZone}>
              <h4>Danger Zone</h4>
              <p>Permanently delete your account and all associated data.</p>
              <button 
                className={`btn btn-primary ${styles.deleteBtn}`}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {showChangePasswordModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Change Password</h3>
            <p>Enter your new password:</p>
            <input type="password" placeholder="New Password" className={styles.input} />
            <p>Confirm your new password:</p>
            <input type="password" placeholder="Confirm Password" className={styles.input} />
            {showChangePassswordError && <p className={styles.error}>Passwords do not match</p>}
            <div className={styles.modalActions}>
              <button 
                className="btn btn-primary" 
                onClick={handleChangePassword}
              >
                Save
              </button>
              <button 
                className={"btn btn-secondary" + " " + styles.cancelBtn}
                onClick={() => setShowChangePasswordModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Confirm Account Deletion</h3>
            <p>Are you sure you want to delete your account?</p>
            <p>This action cannot be undone.</p>
            <div className={styles.modalActions}>
              <button 
                className={"btn btn-secondary" + " " + styles.cancelBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`btn btn-primary ${styles.deleteBtn}`} 
                onClick={handleDeleteAccount}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;