import { useEffect, useRef } from "react";
import styles from "./DropdownMenu.module.css";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function DropdownMenu({ isOpen, onClose, children }: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return isOpen ? (
    <div ref={menuRef} className={styles.dropdownMenu}>
      {children}
    </div>
  ) : null;
}

export default DropdownMenu;
