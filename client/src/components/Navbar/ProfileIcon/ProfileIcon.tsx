import { useState, useRef } from "react";
import styles from "./ProfileIcon.module.css";
import { IUserDetails } from "../../../utils/StorageManager";
import ProfileIconDropDown from "./ProfileIconDropdown";
import { Role } from "../../../models/User";

export interface ProfileIconProps {
    key: number;
    userType: Role | null;
    userDetails: IUserDetails | null;
    onLogout: () => void;
}

function ProfileIcon({ key, userType, userDetails, onLogout }: ProfileIconProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLButtonElement>(null);

    if (!userDetails) return null;

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div className={styles.profileContainer} ref={menuRef}>
            <button ref={iconRef} className={styles.profileIcon} onClick={toggleMenu}>
                {userDetails.fname.charAt(0)}
            </button>
            <ProfileIconDropDown key={key} userType={userType} userDetails={userDetails} onLogout={onLogout} isOpen={menuOpen} menuRef={menuRef} onClose={() => setMenuOpen(false)} />
        </div>
    );
}

export default ProfileIcon;
