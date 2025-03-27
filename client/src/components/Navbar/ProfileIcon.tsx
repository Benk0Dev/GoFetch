import { useState, useRef, useEffect, JSX } from "react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "@client/components/Dropdown/DropdownMenu";
import DropdownItem from "@client/components/Dropdown/DropdownItem";
import styles from "@client/components/Navbar/Navbar.module.css";
import { Role } from "@gofetch/models/IUser";
import { useAuth } from "@client/context/AuthContext";
import { UserRound, LayoutDashboard, ArrowLeftRight, UserRoundPlus, Settings, LogOut } from "lucide-react";

enum OtherAccountOption {
  Switch = "Switch to",
  Become = "Become a"
}

function ProfileIcon() {
  const { user, role, logout, switchRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [otherAccountOption, setOtherAccountOption] = useState<JSX.Element | "">("");
  const [otherAccountOptionOperation, setOtherAccountOptionOperation] = useState<OtherAccountOption | null>(null);
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
    hasBothRoles ? setOtherAccountOptionOperation(OtherAccountOption.Switch) : setOtherAccountOptionOperation(OtherAccountOption.Become);
    return hasBothRoles
      ? (
        <>
          <ArrowLeftRight size={12} />
          <span>{`Switch to ${role === Role.OWNER ? "Pet Minder" : "Pet Owner"}`}</span>
        </>
      ) : (
        <>
          <UserRoundPlus size={12} />
          <span>{`Become a ${role === Role.OWNER ? "Pet Minder" : "Pet Owner"}`}</span>
        </>
      );
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
        <img src={user.primaryUserInfo.profilePic} alt="Profile" />
      </button>

      {menuOpen && (
        <DropdownMenu onClose={toggleMenu}>
          <DropdownItem onClick={() => { navigate("/profile"); toggleMenu(); }} button={true}>
            <UserRound size={14} />
            <span>Profile</span>
          </DropdownItem>
          <DropdownItem onClick={() => { navigate("/dashboard"); toggleMenu(); }} button={true}>
            <LayoutDashboard size={14} />
            <span>Dashboard</span>
          </DropdownItem>
          <hr />
          {otherAccountOption && (
            <DropdownItem
              onClick={() => {
                if (otherAccountOptionOperation === OtherAccountOption.Switch) {
                  switchRole();
                  navigate("/dashboard");
                } else {
                  navigate(role === Role.OWNER ? "/become-minder" : "/become-owner");
                }
                toggleMenu();
              }}
              button={true}
            >
              {otherAccountOption}
            </DropdownItem>

          )}
          <DropdownItem onClick={() => { navigate("/settings"); toggleMenu(); }} button={true}>
            <Settings size={14} />
            <span>Settings</span>
          </DropdownItem>
          <hr />
          <DropdownItem onClick={() => {
            logout();
            navigate("/");
          }} 
          button={true}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </DropdownItem>
        </DropdownMenu>
      )}
    </div>
  );
}

export default ProfileIcon;
