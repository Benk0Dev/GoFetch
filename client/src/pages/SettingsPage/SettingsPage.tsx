import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "@client/pages/SettingsPage/SettingsPage.module.css";
import { useAuth } from "@client/context/AuthContext";
import { deleteUser } from "@client/services/UserRegistry";
import { Role } from "@gofetch/models/IUser";

function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout, role } = useAuth();

  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    deleteUser(user.id);
    logout();
    setShowDeleteModal(false);
    navigate("/");
    console.log("Account deleted");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className={styles.tabContent}>
            <h2>Profile Settings</h2>
            {/* Profile editing form */}
              <h3>Personal Information</h3>
              {/* Name, email, phone inputs */}
              <button>Change Password</button>
              {/* Password change form */}
          </div>
        );
      case "notifications":
        return (
          <div className={styles.tabContent}>
            <h2>Notification Preferences</h2>
            {/* Notification toggles */}
          </div>
        );
      case "pets":
        return role === Role.OWNER ? (
          <div className={styles.tabContent}>
            <h2>My Pets</h2>
            {/* Pet profiles management */}
          </div>
        ) : null;
      case "services":
        return role === Role.MINDER ? (
          <div className={styles.tabContent}>
            <h2>My Services</h2>
            {/* Service settings for minders */}
          </div>
        ) : null;
      case "payment":
        return (
          <div className={styles.tabContent}>
            <h2>Payment Methods</h2>
            {/* Payment methods management */}
          </div>
        );
      case "privacy":
        return (
          <div className={styles.tabContent}>
            <h2>Privacy & Security</h2>
            {/* Privacy settings */}
          </div>
        );
      case "account":
        return (
          <div className={styles.tabContent}>
            <h2>Account Management</h2>
            <div className={styles.dangerZone}>
              <h3>Danger Zone</h3>
              <p>Permanently delete your account and all associated data.</p>
              <button 
                className={styles.deleteAccountButton}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.settingsWrapper}>
        <div className={styles.sidebar}>
          <h2 className={styles.header}>Settings</h2>
          <nav className={styles.tabNav}>
            <button 
              className={`${styles.tabButton} ${activeTab === "profile" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "notifications" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>
            {role === Role.OWNER && (
              <button 
                className={`${styles.tabButton} ${activeTab === "pets" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("pets")}
              >
                My Pets
              </button>
            )}
            {role === Role.MINDER && (
              <button 
                className={`${styles.tabButton} ${activeTab === "services" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("services")}
              >
                My Services
              </button>
            )}
            <button 
              className={`${styles.tabButton} ${activeTab === "payment" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("payment")}
            >
              Payment
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "privacy" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("privacy")}
            >
              Privacy & Security
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === "account" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("account")}
            >
              Account
            </button>
          </nav>
        </div>
        <div className={styles.content}>
          {renderTabContent()}
        </div>
      </div>

      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirm Account Deletion</h2>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className={styles.modalButtons}>
              <button 
                className={styles.cancelButton} 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.deleteButton} 
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;