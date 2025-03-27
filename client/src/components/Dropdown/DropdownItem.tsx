import styles from "@client/components/Dropdown/DropdownMenu.module.css";

interface DropdownItemProps {
  text: string;
  onClick: () => void;
}

function DropdownItem({ text, onClick }: DropdownItemProps) {
  return (
    <button className={styles.dropdownItem} onClick={onClick}>
      {text}
    </button>
  );
}

export default DropdownItem;
