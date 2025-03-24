import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../Dropdown/DropdownMenu";
import DropdownItem from "../Dropdown/DropdownItem";
import styles from "./Navbar.module.css";
import { Role } from "../../models/IUser";
import { useAuth } from "../../context/AuthContext";

function ProfileIcon() {
  const { user, role, logout, switchRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [otherAccountOption, setOtherAccountOption] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  if (!user) return null;

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const getOtherAccountOption = () => {
    if (role === Role.ADMIN) return "";
    const hasBothRoles = user.roles.includes(Role.OWNER) && user.roles.includes(Role.MINDER);
    return hasBothRoles
      ? `Switch to ${role === Role.OWNER ? "Pet Minder" : "Pet Owner"}`
      : `Become a ${role === Role.OWNER ? "Pet Minder" : "Pet Owner"}`;
  };

  useEffect(() => {
    setOtherAccountOption(getOtherAccountOption());
  }, [role]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef?.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className={styles.dropdownContainer} ref={menuRef}>
      <button ref={iconRef} className={styles.profileIcon} onClick={toggleMenu}>
        {user.userDetails.fname.charAt(0)}
      </button>

      {menuOpen && (
        <DropdownMenu onClose={toggleMenu}>
          <DropdownItem text="Profile" onClick={() => { navigate("/profile"); toggleMenu(); }} />
          <DropdownItem text="Dashboard" onClick={() => { navigate("/dashboard"); toggleMenu(); }} />
          <hr />
          {otherAccountOption && (
            <DropdownItem
              text={otherAccountOption}
              onClick={() => {
                if (otherAccountOption.startsWith("Switch")) {
                  switchRole();
                  navigate("/dashboard");
                } else {
                  navigate(role === Role.OWNER ? "/become-minder" : "/become-owner");
                }
                toggleMenu();
              }}
            />
          )}
          <DropdownItem text="Settings" onClick={() => { navigate("/settings"); toggleMenu(); }} />
          <hr />
          <DropdownItem text="Logout" onClick={() => {
            logout();
            navigate("/");
          }} />
        </DropdownMenu>
      )}
    </div>
  );
}

export default ProfileIcon;
