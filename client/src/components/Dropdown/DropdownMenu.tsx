import { useRef } from "react";
import styles from "./DropdownMenu.module.css";

interface DropdownMenuProps {
  onClose: () => void;
  children: React.ReactNode;
}

function DropdownMenu({ children }: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={menuRef} className={styles.dropdownMenu}>
      {children}
    </div>
  );
}

export default DropdownMenu;
