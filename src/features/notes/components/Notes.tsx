import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import GetNotes from "./GetNotes";
import { AddNote } from "./AddNote";
import { NoteByIdEditor } from "./NoteByIdEditor";
import { NoteById } from "./NoteById";
import Notesidebar from "./NoteSidebar";

import styles from "./NoteById.module.css";
import notesStyles from "./Notes.module.css";

import { useDeleteNote } from "../hooks/useDeleteNote";
import { useNoteById } from "../hooks/useNoteById";
import { useAddNote } from "../hooks/useAddNote";

export default function Notes() {

  const [filter] = useState({});
  const [addingNote, setAddingNote] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [currentSubject, setCurrentSubject] = useState("");
  const [currentNote, setCurrentNote] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Alla");

  const queryClient = useQueryClient();
  const addNoteMutation = useAddNote();
  const deleteNoteMutation = useDeleteNote();

  const { data: note, isLoading: noteLoading, error: noteError } = useNoteById(
    selectedNoteId ?? undefined
  );

  const handleAddNoteSave = async (subject: string, note: string): Promise<boolean> => {
    if (!subject || !note.trim()) return false;

    try {
      const createdNote = await addNoteMutation.mutateAsync({ subject, note });

      queryClient.invalidateQueries({ queryKey: ["notesCount"] });

      setSelectedNoteId(createdNote.id);

      return true;
    } catch (error) {
      console.error("Fel vid sparning av anteckning:", error);
      return false;
    }
  };

  const confirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteNoteMutation.mutate(deleteConfirmId, {
      onSuccess: () => {
        setSelectedNoteId(null);
        setDeleteConfirmId(null);
        setEditing(false);
        queryClient.invalidateQueries({ queryKey: ["notesCount"] });
      },
      onError: (err: any) => {
        console.error(err);
        setDeleteConfirmId(null);
      },
    });
  };

  return (
    <div className={notesStyles.notesWrapper}>
      <div className={notesStyles.contentWrapper}>
        <Notesidebar
          onSelectCategory={(category) => setSelectedCategory(category)}
          onAdd={() => setAddingNote(true)}
        />
        <div className={notesStyles.notesListContainer}>
          <div className={notesStyles.notesContentWrapper}>
            {addingNote ? (
              <AddNote
                onSave={handleAddNoteSave}
                onClose={() => setAddingNote(false)}
                subject={currentSubject}
                setSubject={setCurrentSubject}
                noteContent={currentNote}
                setNoteContent={setCurrentNote}
              />
            ) : selectedNoteId ? (
              <div className={`${styles.noteCard} ${editing ? styles.editMode : ""}`}>
               
                {noteLoading && <p>Laddar anteckning...</p>}
                {noteError && <p>Fel: {noteError.message}</p>}
         

                {note && editing && (
                  <NoteByIdEditor
                    noteId={selectedNoteId}
                    initialSubject={note.subject}
                    initialNote={note.note}
                  />
                )}

              {note && !editing && (
  <NoteById
    noteId={selectedNoteId}
   
 
    onClose={() => setSelectedNoteId(null)}
  />
)}

              </div>
            ) : (
              <GetNotes
                filter={filter}
                onSelectNote={setSelectedNoteId}
                selectedCategory={selectedCategory}
              />
            )}
          </div>
        </div>
      </div>
      {deleteConfirmId && (
        <div className={notesStyles.modalOverlay}>
          <div className={notesStyles.modalContent}>
            <p>Vill du verkligen ta bort den här anteckningen?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <button onClick={confirmDelete}>Ja</button>
              <button onClick={() => setDeleteConfirmId(null)}>Nej</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}