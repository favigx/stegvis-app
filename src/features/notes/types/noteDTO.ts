export interface NoteDTO {
    id: string;
    note: string;
    subject: string;
    dateTimeCreated: string;
    dateTimeUpdated: string | null;
}