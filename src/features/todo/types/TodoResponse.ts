export interface TodoResponse {
    id: string;
    description: string;
    subject: string;
    links: string[];
    status: string;
    dateTimeCreated: string;
    dateTimeCompleted?: string;
    durationDays?: number;
}