import styles from './PreferenceChoice.module.css';
import type { EnumButtonProps } from '../../types/props/props';

export function ChoiceButton({ name, selected, onClick, disabled, className }: EnumButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${selected ? '' : ''} ${className ?? ''}`}
    >
      {name}
    </button>
  );
}
