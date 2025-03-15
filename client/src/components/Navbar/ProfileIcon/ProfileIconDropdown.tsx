import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrimaryUser, PetOwner } from "../../../models/User";
import DropdownMenu from "../../Dropdown/DropdownMenu";
import DropdownItem from "../../Dropdown/DropdownItem";
import { ProfileIconProps } from "./ProfileIcon";
import { switchUserRole } from "../../../services/AuthService";

interface ProfileIconDropDownProps extends ProfileIconProps {
    isOpen: boolean;
    menuRef: React.RefObject<HTMLDivElement> | null;
    onClose: () => void;
}

function ProfileIconDropDown({ user, onLogout, isOpen, menuRef, onClose }: ProfileIconDropDownProps) {
    if (!user) return null;

    const getOtherAccountOption = () => {
        
        let text = "";
        if (user.userClass instanceof PrimaryUser) {
            if (user.userClass.role.prevRole !== null) {
                text += "Switch to ";
            } else {
                text += "Become a ";
            }
            text += user.userClass.role.currentRole instanceof PetOwner ? "Pet Minder" : "Pet Owner";
        }
        return text;
    }

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

    return (
        <DropdownMenu isOpen={isOpen} onClose={onClose}>
            <DropdownItem text="Profile" onClick={() => {
                navigate("/profile")
                onClose();
                }} />
            <DropdownItem text="Dashboard" onClick={() => {
                navigate("/dashboard")
                onClose();
                }} />
            <hr />
            {otherAccountOption !== "" && (
                <DropdownItem
                    text={otherAccountOption}
                    onClick={() => {
                        if (user.userClass instanceof PrimaryUser) {
                            if (user.userClass.role.prevRole !== null) {
                                switchUserRole(user);
                                navigate("/dashboard");
                            } else {
                                navigate(user.userClass.role.currentRole instanceof PetOwner ? "/register/petminder" : "/register/petowner");
                            }
                        }
                        updateOtherAccountOption();
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