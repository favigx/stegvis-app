import { useState } from "react";
import type { AddNoteDTO } from "../types/addNoteDTO";
import type { AddNoteResponse } from "../types/addNoteResponse";
import { addNote } from "../api/notesAPI";

export function useAddNote() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AddNoteResponse | null>(null);

  const execute = async (note: AddNoteDTO) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await addNote(note);
      setData(response);
      return response;
    } catch (err: any) {
      setError(err.message || "Ett fel inträffade");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addNote: execute,
    data,
    isLoading,
    error,
  };
}