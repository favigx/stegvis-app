export interface NoteFilterDTO {
  subject?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: "dateTimeCreated" | "dateTimeUpdated" | "subject";
  ascending?: boolean;
}