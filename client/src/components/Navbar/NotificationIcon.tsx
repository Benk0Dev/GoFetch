import { useState, useRef, useEffect } from "react";
import DropdownMenu from "../Dropdown/DropdownMenu";
import DropdownItem from "../Dropdown/DropdownItem";
import styles from "./Navbar.module.css";
import { Bell } from "lucide-react";

function NotificationIcon() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLButtonElement>(null);

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

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

    return (
        <div className={styles.dropdownContainer} ref={menuRef}>
            <button ref={iconRef} className="btn-round btn-transparent" onClick={toggleMenu}>
                <Bell strokeWidth={2.25} />
            </button>
            {menuOpen && (
                <DropdownMenu onClose={toggleMenu}>
                    <DropdownItem text="You have no notifications" onClick={() => {}} />
                </DropdownMenu>
            )}
        </div>
    );
}

export default NotificationIcon;
