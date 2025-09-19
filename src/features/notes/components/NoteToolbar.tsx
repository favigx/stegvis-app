import { type JSX } from "react";
import { Trash, X, Pencil, PencilOff, Bot } from "lucide-react";
import styles from "./NoteToolbar.module.css";

interface NoteToolbarProps {
  onDelete: () => void;
  onToggleEdit: () => void;
  onClose: () => void;
  isEditing: boolean;
  isDeleting?: boolean;
}

export function NoteToolbar({
  onDelete,
  onToggleEdit,
  onClose,
  isEditing,
  isDeleting = false,
}: NoteToolbarProps) {

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
        icon={<Trash size={18} color="#ff0000ff" />}
        onClick={onDelete}
        disabled={isDeleting}
      />
      <IconButton
        icon={isEditing ? <PencilOff size={18} color="#928910ff" /> : <Pencil size={18} color="#928910ff" />}
        onClick={onToggleEdit}
      />
        <IconButton
        icon={<Bot size={22} color="#898997ff" />}
        onClick={onDelete}
        disabled={isDeleting}
      />
      <IconButton
        icon={<X size={20} color="#37373dff" />}
        onClick={onClose}
      />
    </div>
  );
}
