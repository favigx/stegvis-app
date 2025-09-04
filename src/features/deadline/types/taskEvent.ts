export interface TaskEvent {
  id: string;
  subject: string;
  type: string;
  start: Date;
  end: Date;
  status: "completed" | "pending" | "overdue";
}