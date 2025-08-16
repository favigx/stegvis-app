import { useState } from "react";
import moment from "moment";
import styles from './Calender.module.css';

interface TaskEvent {
  id: string;
  subject: string;
  type: string;
  start: Date;
  end: Date;
  status: "completed" | "pending" | "overdue";
}

interface ModernCalendarProps {
  events: TaskEvent[];
  onTimeSelect?: (date: Date) => void;
}

export function ModernCalendar({ events, onTimeSelect }: ModernCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(moment());

  const startOfWeek = currentWeek.clone().startOf('isoWeek');
  const days = Array.from({ length: 7 }).map((_, i) =>
    startOfWeek.clone().add(i, 'days')
  );

  const hours = Array.from({ length: 24 }).map((_, i) => i);

  const prevWeek = () => setCurrentWeek(currentWeek.clone().subtract(1, 'week'));
  const nextWeek = () => setCurrentWeek(currentWeek.clone().add(1, 'week'));

  const handleTimeClick = (day: moment.Moment, hour: number) => {
    if (onTimeSelect) {
      const selectedDate = day.clone().hour(hour).minute(0).toDate();
      onTimeSelect(selectedDate);
    }
  };

  const svenskaVeckodagar = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.navBar}>
        <button className={styles.navButton} onClick={prevWeek}>← Föregående</button>
        <div>{startOfWeek.format("D MMM")} - {startOfWeek.clone().add(6, 'days').format("D MMM")}</div>
        <button className={styles.navButton} onClick={nextWeek}>Nästa →</button>
      </div>

      <div className={styles.weekGrid}>
        {days.map(day => (
          <div key={day.toString()} className={styles.dayColumn}>
            <div className={styles.dayHeader}>
              {svenskaVeckodagar[day.day()]} {day.date()}
            </div>

            {hours.map(hour => (
              <div
                key={hour}
                className={styles.timeSlot}
                onClick={() => handleTimeClick(day, hour)}
              >
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                  {hour.toString().padStart(2, '0')}:00
                </span>

                {events
                  .filter(event => {
                    const eventStart = moment(event.start);
                    return (
                      eventStart.isSame(day, 'day') && eventStart.hour() === hour
                    );
                  })
                  .map(event => (
                    <div key={event.id} className={styles.eventCard}>
                      <strong>{event.subject}</strong>
                      <div className={styles.eventType}>
                        {event.type} ({moment(event.start).format("HH:mm")}-{moment(event.end).format("HH:mm")})
                      </div>
                      <div className={styles.statusDots}>
                        <div className={`${styles.statusDot} ${styles[event.status]}`}></div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}