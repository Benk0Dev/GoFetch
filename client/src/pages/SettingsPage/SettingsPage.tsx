import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "@client/pages/SettingsPage/SettingsPage.module.css";
import { useAuth } from "@client/context/AuthContext";
import { deleteUser } from "@client/services/UserRegistry";
import BackButton from "@client/components/BackButton";
import Switch from "react-switch";

function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Temporary - will need to add settings to backend
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

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

  const handleNotificationToggle = () => {
    setNotificationsEnabled(prev => !prev);
    // Add logic to update the backend settings
  }

  const handleSoundToggle = () => {
    setSoundEnabled(prev => !prev);
    // Add logic to update the backend settings
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
            <button className="btn btn-primary">Change Password</button>
          </div>
          <div className={styles.settingsSection}>
            <h5>Notifications</h5>
            <div className={styles.notificationSetting}>
              <p>Notfications Enabled</p>
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
              <p>Sound Notifications</p>
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
                disabled={!notificationsEnabled}
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