export interface UploadFileResponse {
    id: string;
    todoId: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    dateTimeUploaded: string;
}