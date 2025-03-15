import { useState, useRef } from "react";
import styles from "./ProfileIcon.module.css";
import User from "../../../models/User";
import ProfileIconDropDown from "./ProfileIconDropdown";

export interface ProfileIconProps {
    user: User | null;
    onLogout: () => void;
}

function ProfileIcon({ user, onLogout }: ProfileIconProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLButtonElement>(null);

    if (!user) return null;

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <div className={styles.profileContainer} ref={menuRef}>
            <button ref={iconRef} className={styles.profileIcon} onClick={toggleMenu}>
                {user.userDetails.fname.charAt(0)}
            </button>
            <ProfileIconDropDown user={user} onLogout={onLogout} isOpen={menuOpen} menuRef={menuRef} onClose={() => setMenuOpen(false)} />
        </div>
    );
}

export default ProfileIcon;
