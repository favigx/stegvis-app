export interface AddTaskResponse {
    taskId: string;
    subject: string;
    type: string;
    deadline: string;
    daysLeft: number;
    pastDue: boolean;
}