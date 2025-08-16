import styles from './EnomButton.module.css';

interface EnumButtonsProps {
  title: string;
  options: string[];
  selected: string | string[] | null;
  onSelect: (value: string | string[]) => void;
  multiple?: boolean;
}

export function EnumButtons({
  title,
  options,
  selected,
  onSelect,
  multiple = false,
}: EnumButtonsProps) {
  const isSelected = (option: string) => {
    if (multiple && Array.isArray(selected)) {
      return selected.includes(option);
    }
    return selected?.toString() === option.toString();
  };

  const handleClick = (option: string) => {
    let newValue: string | string[];
    if (multiple) {
      if (!Array.isArray(selected)) {
        newValue = [option];
      } else if (selected.includes(option)) {
        newValue = selected.filter((s) => s !== option);
      } else {
        newValue = [...selected, option];
      }
    } else {
      newValue = option;
    }
    onSelect(newValue);
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