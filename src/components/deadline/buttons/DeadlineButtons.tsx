import styles from './DeadlineButtons.module.css';
import type { TaskEvent } from '../types'; 

interface DeadlineButtonsProps {
  events: TaskEvent[];
  onSelect: (eventId: string) => void;
  selectedId?: string | null;
}

export function DeadlineButtons({ events, onSelect, selectedId }: DeadlineButtonsProps) {
  const isSelected = (id: string) => id === selectedId;

  return (
    <div className={styles.buttonContainer}>
      {events.map((event) => (
        <button
          key={event.id}
          onClick={() => onSelect(event.id)}
          className={`${styles.button} ${isSelected(event.id) ? styles.selected : styles.unselected}`}
        >
          <div className={styles.subject}>{event.subject}</div>
          <div className={styles.date}>
            {new Date(event.start).toLocaleDateString()} 
            {" - "} {event.status}
          </div>
        </button>
      ))}
    </div>
  );
}
