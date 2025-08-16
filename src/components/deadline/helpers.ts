import moment from "moment";
import type { TaskDTO } from "../../interfaces/calender/task/dto/task"; 
import type { TaskEvent } from "./types";

export function mapTaskDTOsToEvents(data: TaskDTO[]): TaskEvent[] {
  return data.map((task) => {
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
}