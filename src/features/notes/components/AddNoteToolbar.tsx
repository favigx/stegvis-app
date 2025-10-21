import { type JSX } from "react";
import { Save, X } from "lucide-react";
import styles from "./AddNoteToolbar.module.css";

interface AddNoteToolbarProps {
  subject: string;
  note: string;
  onSave: (subject: string, note: string) => void;
  onClose: () => void;
  isSaving?: boolean;
}

export function AddNoteToolbar({
  subject,
  note,
  onSave,
  onClose,
  isSaving = false,
}: AddNoteToolbarProps) {
  const IconButton = ({
    icon,
    onClick,
    disabled,
  }: {
    icon: JSX.Element;
    onClick: () => void;
    disabled?: boolean;
  }) => (
    <button
      className={styles.iconButton}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  );

  return (
    <div className={styles.toolbarContainer}>
   
      <IconButton
        icon={<X size={20} color="#fa0c0cff" />}
        onClick={onClose}
      />
    </div>
  );
}
