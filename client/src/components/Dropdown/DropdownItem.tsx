import styles from "@client/components/Dropdown/DropdownMenu.module.css";

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  button: boolean;
}

function DropdownItem({ children, onClick, button }: DropdownItemProps) {
  return button ? (
    <button className={styles.dropdownItem} onClick={onClick}>
      {children}
    </button>
  ) : (
    <div className={styles.dropdownItem} onClick={onClick}>
      {children}
    </div>
  );
}

export default DropdownItem;
