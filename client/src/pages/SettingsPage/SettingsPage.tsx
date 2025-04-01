import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "@client/pages/SettingsPage/SettingsPage.module.css";
import { useAuth } from "@client/context/AuthContext";
import { deleteUser } from "@client/services/UserRegistry";
import BackButton from "@client/components/BackButton";

function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate();

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
            <span>*Change Password*</span>
          </div>
          <div className={styles.settingsSection}>
            <h5>Notifications</h5>
            {/* Notification toggles */}
            <span>*Notifications Enabled Toggle*</span>
            <span>*Notification Sounds Toggle*</span>
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