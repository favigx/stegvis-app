import { useEffect, useState, useCallback } from "react";
import { SimpleCalender } from "./calendar/SimpleCalendar";
import { getTasks } from "../api/taskAPI"; 
import type { TaskDTO } from "../types/taskDTO"; 
import styles from './Deadline.module.css';

import { mapTaskDTOsToEvents } from "../utils/mapTaskDTOsToEvents"; 
import type { TaskEvent } from "../types/taskEvent"; 

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
      
      </div>
    </div>
  );
}