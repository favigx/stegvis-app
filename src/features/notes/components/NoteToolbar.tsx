import { type JSX } from "react";
import { Trash, X, Pencil, PencilOff, Bot, BookOpen } from "lucide-react";
import styles from "./NoteToolbar.module.css";

interface NoteToolbarProps {
  onDelete: () => void;
  onToggleEdit: () => void;
  onClose: () => void;
  onOptimize?: () => void;
  onGenerateQuiz?: () => void;
  isEditing: boolean;
  isDeleting?: boolean;
}

export function NoteToolbar({
  onDelete,
  onToggleEdit,
  onClose,
  onOptimize,
  onGenerateQuiz,
  isEditing,
  isDeleting = false,
}: NoteToolbarProps) {
  const IconButton = ({
    icon,
    label,
    onClick,
    disabled,
    className,
  }: {
    icon: JSX.Element;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
  }) => (
    <button
      className={`${styles.iconButton} ${className ?? ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span className={styles.iconLabel}>{label}</span>
    </button>
  );

  return (
    <div className={styles.toolbarContainer}>
      <IconButton
        icon={<X size={16} />}
        label="Stäng"
        onClick={onClose}
        className={styles.close}
      />
      <IconButton
        icon={isEditing ? <PencilOff size={16} /> : <Pencil size={16} />}
        label={isEditing ? "Avsluta redigering" : "Redigera"}
        onClick={onToggleEdit}
        className={styles.edit}
      />
      <IconButton
        icon={<Bot size={16} />}
        label="Optimera med AI"
        onClick={onOptimize!}
        disabled={isDeleting}
        className={styles.optimize}
      />
      <IconButton
        icon={<BookOpen size={16} />}
        label="Generera Quiz med AI"
        onClick={onGenerateQuiz!}
        disabled={isDeleting}
        className={styles.generate}
      />
      <IconButton
        icon={<Trash size={16} />}
        label="Radera"
        onClick={onDelete}
        disabled={isDeleting}
        className={styles.trash}
      />
    </div>
  );
}
