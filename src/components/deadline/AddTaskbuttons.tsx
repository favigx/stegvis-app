import styles from './AddTaskButtons.module.css';

interface EnumButtonsProps {
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}

export function AddTaskButtons({ title, options, selected, onSelect }: EnumButtonsProps) {
  const isSelected = (option: string) => selected?.toString() === option.toString();

  const handleClick = (option: string) => {
    onSelect(option);
  };

  return (
    <div className={styles.buttonContainer}>
      <div className={styles.row}>
        <div className={styles.title}>{title}</div>
        <div className={styles.container}>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleClick(opt)}
              className={`${styles.button} ${
                isSelected(opt) ? styles.selected : styles.unselected
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}