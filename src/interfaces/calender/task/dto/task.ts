export interface TaskDTO {
    id: string;
    subject: string;
    type: string;
    deadline: string;
    daysLeft: number;
    pastDue: boolean;
}