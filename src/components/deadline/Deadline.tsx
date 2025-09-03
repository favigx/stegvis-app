import { useEffect, useState, useCallback } from "react";
import { SimpleCalender } from "./calendar/SimpleCalendar";
import { getTasks } from "../../api/calender/task/task";
import type { TaskDTO } from "../../interfaces/calender/task/dto/task";
import styles from './Deadline.module.css';
import { AddTask } from "./add-task/AddTask";
import { mapTaskDTOsToEvents } from "./helpers"; 
import type { TaskEvent } from "./types";

export function Deadline() {
  const [events, setEvents] = useState<TaskEvent[]>([]);

  const fetchTasks = useCallback(async () => {
    try {
      const data: TaskDTO[] = await getTasks();
      setEvents(mapTaskDTOsToEvents(data));
      console.log("Uppgifter hämtade:", data);
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