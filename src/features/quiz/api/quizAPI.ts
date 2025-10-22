import type { NoteQuizResponse } from "../types/noteQuizResponse";
import { apiClient  } from "../../../api/apiClient";


const PREFERENCE_API_BASE = "/quiz/note";

export async function getAllUserNoteQuizzes(): Promise<NoteQuizResponse[]> {
    try {
        const response = await apiClient.get<NoteQuizResponse[]>(`${PREFERENCE_API_BASE}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte hämta anteckningsquiz");
        }
        throw new Error("Kunde inte nå servern")
    }
}

export async function getUserNoteQuizById(quizId: string): Promise<NoteQuizResponse> {
    try {
        const response = await apiClient.get<NoteQuizResponse>(`${PREFERENCE_API_BASE}/${quizId}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte hämta anteckningsquiz");
        }
        throw new Error("Kunde inte nå servern")
    }
}

export async function getAllUserQuizzesByCourseName(courseName: string): Promise<NoteQuizResponse[]> {
    try {
        const response = await apiClient.get<NoteQuizResponse[]>(
            `${PREFERENCE_API_BASE}/by-course`,
            {
                params: { courseName }, 
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data?.message || "Kunde inte hämta anteckningsquiz för kurs");
        }
        throw new Error("Kunde inte nå servern");
    }
}
