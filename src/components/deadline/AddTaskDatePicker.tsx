import DatePicker from "react-datepicker";
import styless from './AddTaskDatePicker.module.css';
import styles from './AddTaskButtons.module.css';

interface AddTaskDatePickerProps {
  title: string;
  selected: Date | null;
  onSelect: (date: Date) => void;
}

export function AddTaskDatePickerButton({ title, selected, onSelect }: AddTaskDatePickerProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleString('sv-SE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className={styles.buttonContainer}>
      <div className={styles.row}>
        <div className={styles.title}>{title}</div>
        <div className={styles.container}>
          <DatePicker
            selected={selected}
            onChange={(date) => date && onSelect(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="Pp"
            locale="sv"
            todayButton="Idag"
            timeCaption="Tid"
            customInput={
              <button className={styles.button}>
                {selected ? formatDate(selected) : "Välj datum"}
              </button>
            }
            calendarClassName={styless.datePicker}
          />
        </div>
      </div>
    </div>
  );
}