export interface TodoResponse {
    id: string;
    description: string;
    subject: string;
    status: string;
    dateTimeCreated: string;
    dateTimeCompleted?: string;
}