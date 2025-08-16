import moment from "moment";
import styles from './SimpleCalendar.module.css';

interface TaskEvent {
  id: string;
  subject: string;
  type: string;
  start: Date;
  end: Date;
  status: "completed" | "pending" | "overdue";
}

interface SimpleEventCardsProps {
  events: TaskEvent[];
}

export function SimpleCalender({ events }: SimpleEventCardsProps) {
  const today = moment();
  const svenskaVeckodagar = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];

  const sortedEvents = [...events]
    .sort((a, b) => moment(a.start).diff(moment(b.start)))
    .filter(event => moment(event.start).diff(today, 'days') >= 0);

  return (
    
    <div className={styles.calendarWrapper}>
      <div className={styles.simpleWeekGrid}>
        {sortedEvents.map(event => {
          const day = moment(event.start);
          const daysLeft = day.diff(today, 'days');

          return (
            <div key={event.id} className={styles.dayCard}>
              <div className={styles.dayHeader}>
                {svenskaVeckodagar[day.day()]} {day.format("D/M")}
              </div>

              <div className={styles.dayEvents}>
                <div className={styles.eventCard}>
                  <strong>{event.subject}</strong>
                  <div className={styles.eventType}>
                    {event.type} ({day.format("HH:mm")}-{moment(event.end).format("HH:mm")})
                  </div>
                  <div className={styles.daysLeft}>
                    {daysLeft === 0 ? "Idag" : `${daysLeft} dagar kvar`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
