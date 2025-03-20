import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../Dropdown/DropdownMenu";
import DropdownItem from "../Dropdown/DropdownItem";
import styles from "./Navbar.module.css";
import { switchRole } from "../../services/Registry";
import { IUser, Role } from "../../models/IUser";
import { getUserRole } from "../../utils/StorageManager";

export interface ProfileIconProps {
    key: number;
    user: IUser | null;
    onLogout: () => void;
}

function ProfileIcon({ key, user, onLogout }: ProfileIconProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLButtonElement>(null);

    if (!user) return null;

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const getOtherAccountOption = () => {
        let text = "";
        if (getUserRole() === Role.ADMIN) return text;
        if (user.roles.includes(Role.OWNER) && user.roles.includes(Role.MINDER)) {
            text += "Switch to ";
        } else {
            text += "Become a ";
        }
        text += getUserRole() === Role.OWNER ? "Pet Minder" : "Pet Owner";
        return text;
    };

    const navigate = useNavigate();
    const [otherAccountOption, setOtherAccountOption] = useState<string>(() => getOtherAccountOption());

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef?.current && !menuRef.current.contains(event.target as Node)) {
                toggleMenu();
            }
        }

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef, toggleMenu]);

    const updateOtherAccountOption = () => {
        setOtherAccountOption(getOtherAccountOption());
    };

    useEffect(() => {
        updateOtherAccountOption();
    }, [key]);

    return (
        <div className={styles.dropdownContainer} ref={menuRef}>
            <button ref={iconRef} className={styles.profileIcon} onClick={toggleMenu}>
                {user.userDetails.fname.charAt(0)}
            </button>
            {menuOpen && (
                <DropdownMenu onClose={toggleMenu}>
                    <DropdownItem text="Profile" onClick={() => {
                        navigate("/profile")
                        toggleMenu();
                    }} />
                    <DropdownItem text="Dashboard" onClick={() => {
                            navigate("/dashboard")
                            toggleMenu();
                    }} />
                    <hr />
                    {otherAccountOption !== "" && (
                        <DropdownItem
                            text={otherAccountOption}
                            onClick={() => {
                                if (otherAccountOption.startsWith("Switch")) {
                                    switchRole();
                                    navigate("/dashboard");
                                } else {
                                    navigate(getUserRole() === Role.OWNER ? "/register-minder" : "/register-owner");
                                }
                                toggleMenu();
                            }}
                        />
                    )}
                    <DropdownItem text="Settings" onClick={() => {
                        navigate("/settings")
                        toggleMenu();
                        }} />
                    <hr />
                    <DropdownItem text="Logout" onClick={() => {
                            onLogout(); 
                            toggleMenu();
                    }} />
                </DropdownMenu>
            )}
        </div>
    );
}

export default ProfileIcon;
