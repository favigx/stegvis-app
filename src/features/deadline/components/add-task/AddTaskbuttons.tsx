import styles from './AddTaskButtons.module.css';
import { getUniqueSubjectColor } from '../../../notes/utils/getSubjectColor';

interface AddTaskButtonsProps {
  title: string;
  options: string[] | null;
  selected: string;
  onSelect: (value: string) => void;
  collapsed?: boolean;
}

export function AddTaskButtons({ title, options, selected, onSelect, collapsed = false }: AddTaskButtonsProps) {
  const renderOptions = collapsed ? (selected ? [selected] : []) : options || [];

  return (
    <div className={styles.wrapper}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.container}>
        {renderOptions.map((option) => {
          const color = getUniqueSubjectColor(option);
          const isSelected = selected === option;

    const collapsedStyle: React.CSSProperties = collapsed
  ? {
  
      maxWidth: 'fit-content',
      border: '1px solid #ffffffff',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      color: 'black',
      
      borderRadius: '50px',
      padding: '12px 24px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'default',
      position: 'absolute',
      left: '-20px',
      top: '-10px',
    }
  : {};

          return (
            <button
              key={option}
              onClick={() => !collapsed && onSelect(option)}
              className={`${styles.button} ${isSelected ? styles.selected : styles.unselected}`}
              style={collapsed ? collapsedStyle : undefined}
              disabled={collapsed} // gör collapsed "non-clickable"
            >
              <span
                className={styles.colorCircle}
                style={{ backgroundColor: color }}
              />
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
