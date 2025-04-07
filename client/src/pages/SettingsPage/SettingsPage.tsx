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
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) return;

    if (newPassword.length < 8) {
      setChangePasswordError("Password must be at least 8 characters long.");
      return;
    }
    
    if (newPassword !== newPassword2) {
      setChangePasswordError("Passwords do not match.");
      return;
    }
  
    const updatedUser = await editUser(user.id, { loginDetails: { password: newPassword } })

    if (updatedUser) {
      console.log("Password changed successfully");
      setChangePasswordError("");
      setShowChangePasswordModal(false);
      setNewPassword("");
      setNewPassword2("");
      alert("Password changed successfully");
    } else {
      setChangePasswordError("Failed to change password. Please try again.");
      return;
    }
  }

  const handleNotificationToggle = () => {
    setNotificationsEnabled(prev => !prev);
    localStorage.setItem("notificationsEnabled", JSON.stringify(!notificationsEnabled));
  }

  const handleSoundToggle = () => {
    setSoundEnabled(prev => !prev);
    localStorage.setItem("soundEnabled", JSON.stringify(!soundEnabled));
  }

  const handleDeleteAccount = async () => {
    await deleteUser(user.id);
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
                disabled={!notificationsEnabled}
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
            <form onSubmit={handleChangePassword} onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleChangePassword(e);
              }
            }}>
              <div className={styles.inputRow}>
                <label>New Password</label>
                <input type="password" className={styles.input} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className={styles.inputRow}>
                <label>Confirm New Password</label>
                <input type="password" className={styles.input} onChange={(e) => setNewPassword2(e.target.value)} required />
              </div>
              <p className={styles.error}>{changePasswordError}</p>
              <div className={styles.modalActions}>
                <button 
                  className={"btn btn-secondary" + " " + styles.cancelBtn}
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setChangePasswordError("");
                    setNewPassword("");
                    setNewPassword2("");
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
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