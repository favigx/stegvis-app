import { useEffect, useState, useCallback } from "react";
import { SimpleCalender } from "./SimpleCalender";
import { getTasksByUserId } from "../../api/calender/task/task";
import type { TaskDTO } from "../../interfaces/calender/task/dto/task";
import styles from './Deadline.module.css';
import moment from "moment";
import { AddTask } from "./AddTask";

export interface TaskEvent {
  id: string;
  subject: string;
  type: string;
  start: Date;
  end: Date;
  status: "completed" | "pending" | "overdue";
}

export function DeadLine() {
  const [events, setEvents] = useState<TaskEvent[]>([]);

  const fetchTasks = useCallback(async () => {
    try {
      const data: TaskDTO[] = await getTasksByUserId();
      const mappedEvents: TaskEvent[] = data.map((task) => {
        const deadlineString = task.deadline.replace('Z', '');
        const startDate = moment(deadlineString).toDate();
        const endDate = moment(deadlineString).add(1, 'hour').toDate();

        return {
          id: task.id,
          subject: task.subject || "Ingen rubrik",
          type: task.type || "Okänt",
          start: startDate,
          end: endDate,
          status: task.pastDue
            ? "overdue"
            : task.daysLeft <= 0
            ? "completed"
            : "pending",
        };
      });

      setEvents(mappedEvents);
    } catch (err) {
      console.error("Fel vid hämtning av uppgifter:", err);
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className={styles.containerWrapper}>
      <SimpleCalender events={events} />
      <div>
        <AddTask onTaskAdded={fetchTasks} />
      </div>
    </div>
  );
}