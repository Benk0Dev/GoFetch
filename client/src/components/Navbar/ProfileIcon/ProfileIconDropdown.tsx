import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownMenu from "../../Dropdown/DropdownMenu";
import DropdownItem from "../../Dropdown/DropdownItem";
import { ProfileIconProps } from "./ProfileIcon";
import { switchUserRole } from "../../../services/AuthService";
import { Role } from "../../../models/User";

interface ProfileIconDropDownProps extends ProfileIconProps {
    isOpen: boolean;
    menuRef: React.RefObject<HTMLDivElement> | null;
    onClose: () => void;
}

function ProfileIconDropDown({ key, userType, userDetails, onLogout, isOpen, menuRef, onClose }: ProfileIconDropDownProps) {
    if (!userDetails) return null;

    const getOtherAccountOption = () => {
        let text = "";
        if (userType === Role.ADMIN) return text;
        if (userDetails.allRoles.includes(Role.OWNER) && userDetails.allRoles.includes(Role.MINDER)) {
            text += "Switch to ";
        } else {
            text += "Become a ";
        }
        text += userType === Role.OWNER ? "Pet Minder" : "Pet Owner";
        return text;
    };

    const navigate = useNavigate();
    const [otherAccountOption, setOtherAccountOption] = useState<string>(() => getOtherAccountOption());

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef?.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef, onClose]);

    const updateOtherAccountOption = () => {
        setOtherAccountOption(getOtherAccountOption());
    };

    useEffect(() => {
        updateOtherAccountOption();
    }, [key]);

    return (
        <DropdownMenu isOpen={isOpen} onClose={onClose}>
            <DropdownItem text="Profile" onClick={() => {
                navigate("/profile")
                onClose();
                }} />
            {otherAccountOption !== "" && (
                <DropdownItem
                    text={otherAccountOption}
                    onClick={() => {
                        if (otherAccountOption.startsWith("Switch")) {
                            switchUserRole();
                            navigate("/dashboard");
                        } else {
                            navigate(userType === Role.OWNER ? "/register/petminder" : "/register/petowner");
                        }
                        onClose();
                    }}
                />
            )}
            <DropdownItem text="Settings" onClick={() => {
                navigate("/settings")
                onClose();
                }} />
            <hr />
            <DropdownItem text="Logout" onClick={() => {
                    onLogout(); 
                    onClose();
            }} />
        </DropdownMenu>
    );
}

export default ProfileIconDropDown;