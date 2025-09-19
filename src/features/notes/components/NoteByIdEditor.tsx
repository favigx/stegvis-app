import { useState, useEffect } from "react";
import { useEditNote } from "../hooks/useEditNote";
import type { EditNoteDTO } from "../types/editNoteDTO";
import { RichTextEditor } from "./RichTextEditor";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { AddTaskButtons } from "../../deadline/components/add-task/AddTaskbuttons";
import styless from './NoteById.module.css';
import styles from './NoteByIdEditor.module.css';

interface NoteByIdEditorProps {
  noteId: string;
  initialSubject: string;
  initialNote: string;
}

export function NoteByIdEditor({ noteId, initialSubject, initialNote }: NoteByIdEditorProps) {
  const userPrefs = useSelector((state: RootState) => state.preferences);
  const subjects = userPrefs.subjects || [];

  const [subject, setSubject] = useState<string>(initialSubject);
  const [noteContent, setNoteContent] = useState<string>(initialNote);

  const { editNote, status, isLoading, isError, error } = useEditNote();

  useEffect(() => {
    editNote(noteId, { subject, note: noteContent } as EditNoteDTO);
  }, [subject, noteContent, noteId]);

  return (
    <div className={styless.noteDetailContainer}>
      <div className={styles.noteCard}>
    
        <AddTaskButtons
          title="Ämne"
          options={subjects}
          selected={subject}
          onSelect={setSubject}
        />

        <div style={{ marginTop: '0.5rem' }}>
          <RichTextEditor content={noteContent} onChange={setNoteContent} />
        </div>

        <p style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "0.5rem" }}>
          {isLoading && "Sparar..."}
          {status === "success" && "Sparad"}
          {isError && error?.message && `Fel vid sparning: ${error.message}`}
        </p>
      </div>
    </div>
  );
}