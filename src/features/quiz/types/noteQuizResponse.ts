import type { QuestionResponse } from "./questionResponse";

export interface NoteQuizResponse { 
    id: string;
    quizName: string;
    courseName: string;
    questions: QuestionResponse[];
}
