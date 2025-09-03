import styles from './PreferenceChoice.module.css';
import type { EnumButtonProps } from '../types/types';

export function ChoiceButton({ name, selected, onClick, disabled, className }: EnumButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className ?? ''} ${selected ? styles.selected : styles.unselected}`}
      disabled={disabled}
    >
      {name}
    </button>
  );
}
