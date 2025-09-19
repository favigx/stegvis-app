import { useState } from "react";
import { XCircle } from "lucide-react";
import GetNotes from "./GetNotes";
import { AddNote } from "./AddNote";
import { NoteByIdEditor } from "./NoteByIdEditor";
import { NoteById } from "./NoteById";
import { NoteToolbar } from "./NoteToolbar";
import { SearchToolbar } from "./SearchToolbar";
import containerStyles from "../../../layout/Container.module.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useDeleteNote } from "../hooks/useDeleteNote";
import { useNoteById } from "../hooks/useNoteById";
import { useGetNotesCount } from "../hooks/useGetNotesCount";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./NoteById.module.css";
import notesStyles from "./Notes.module.css";
import addNoteStyle from "./AddNote.module.css";

export default function Notes() {
  const userPrefs = useSelector((state: RootState) => state.preferences);
  const subjects = userPrefs.subjects || [];

  const [filter, setFilter] = useState({});
  const [addingNote, setAddingNote] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const deleteNoteMutation = useDeleteNote();
  const isDeleting = deleteNoteMutation.status === "pending";
  const queryClient = useQueryClient();

  const handleNoteAdded = () => {
    setAddingNote(false);
    queryClient.invalidateQueries({ queryKey: ["notesCount"] });
  };

  const handleDelete = (noteId: string) => setDeleteConfirmId(noteId);

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

  const {
    data: note,
    isLoading: noteLoading,
    error: noteError,
  } = useNoteById(selectedNoteId ?? undefined);

  const {
    data: notesCount,
    isLoading: countLoading,
    isError: countError,
  } = useGetNotesCount();

  return (
    <div className={notesStyles.notesWrapper}>
      <div className={notesStyles.topToolbar}>
        <SearchToolbar
          subjects={subjects}
          filter={filter}
          onFilterChange={setFilter}
          onAddNote={() => setAddingNote(true)}
        />
      </div>
      <div className={notesStyles.contentWrapper}>
        <div className={notesStyles.noteContainer}>
          <GetNotes
            filter={filter}
            onSelectNote={(noteId: string) => {
              setSelectedNoteId(noteId);
              setEditing(false);
            }}
          />

          <div className={notesStyles.noteCount}>
            {countLoading
              ? "Laddar antal..."
              : countError
              ? "Fel vid hämtning"
              : `${notesCount} anteckningar`}
          </div>
        </div>
        {selectedNoteId && (
          <div className={styles.noteCard}>
            <NoteToolbar
              onDelete={() => handleDelete(selectedNoteId)}
              onToggleEdit={() => setEditing(!editing)}
              onClose={() => {
                setSelectedNoteId(null);
                setEditing(false);
              }}
              isEditing={editing}
              isDeleting={isDeleting}
            />

            {noteLoading && <p>Laddar anteckning...</p>}
            {noteError && <p>Fel: {noteError.message}</p>}
            {note && editing && (
              <NoteByIdEditor
                noteId={selectedNoteId}
                initialSubject={note.subject}
                initialNote={note.note}
              />
            )}
            {note && !editing && <NoteById noteId={selectedNoteId} />}
          </div>
        )}
        {addingNote && (
          <div className={addNoteStyle.container}>
            <button onClick={() => setAddingNote(false)}>
              <XCircle size={28} color="#ffffffff" />
            </button>
            <AddNote onNoteAdded={handleNoteAdded} />
          </div>
        )}
      </div>
      {deleteConfirmId && (
        <div className={containerStyles.modalOverlay}>
          <div className={containerStyles.modalContent}>
            <p>Är du säker på att du vill ta bort anteckningen?</p>
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