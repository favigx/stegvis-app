import { useState } from "react";
import { useGetNotes } from "../hooks/useGetNotes";
import styles from "./GetNotes.module.css";
import { formatDate } from "../../../utils/formatDate";
import { sanitizeAndTrimNote } from "../utils/displayNoteInList";
import { getUniqueSubjectColor } from "../utils/getSubjectColor";
import { Trash2, CornerUpRight } from "lucide-react";

interface GetNotesProps {
  filter?: {
    subject?: string;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    ascending?: boolean;
  };
  selectedCategory?: string;
  onSelectNote?: (id: string) => void;
}

function GetNotes({ filter, selectedCategory, onSelectNote }: GetNotesProps) {
  const { data: notes, isLoading, error } = useGetNotes(filter);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const headerTitle = selectedCategory || filter?.subject || "Alla";

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (!notes) return;
    if (selectedIds.size === notes.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(notes.map((n) => n.id)));
  };

  const deleteSelected = () => {
    alert("Ta bort dessa IDs: " + Array.from(selectedIds).join(", "));
    setSelectedIds(new Set());
  };

  const moveSelected = () => {
    alert("Flytta dessa IDs: " + Array.from(selectedIds).join(", "));
  };

  if (isLoading) return <p>Laddar anteckningar...</p>;
  if (error) return <p className={styles.error}>{error.message}</p>;

  const allSelected = notes && selectedIds.size === notes.length;

  return (
    <div className={styles.notesListWrapper}>
      {/* Rubrik */}
      <h2 className={styles.headerTitle}>{headerTitle}</h2>

      {/* Lista med anteckningar */}
      <div className={styles.notesList}>
        {/* Markera alla */}
{notes && notes.length > 0 && (
  <div className={`${styles.buttonContainer} ${styles.selectAllRow}`}>
    <div>
      <input
        type="checkbox"
        checked={allSelected}
        onChange={toggleSelectAll}
        className={styles.roundCheckbox}
      />
    </div>
    <div className={styles.notePreview}>
      <strong>Markera alla</strong>
    </div>
    <div style={{ display: "flex", gap: "8px" }}>
      {selectedIds.size > 0 && (
        <>
          <button
            onClick={deleteSelected}
            className={styles.iconButton}
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={moveSelected}
            className={styles.iconButton}
          >
            <CornerUpRight size={18} />
          </button>
        </>
      )}
    </div>
  </div>
)}

        {notes?.map((note, index) => (
          <div key={note.id} style={{ width: "100%" }}>
            <div
              className={`${styles.buttonContainer} ${
                selectedIds.has(note.id) ? styles.selected : ""
              }`}
              style={{ cursor: onSelectNote ? "pointer" : "default" }}
              onClick={() => onSelectNote?.(note.id)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(note.id)}
                  onChange={() => toggleSelect(note.id)}
                  className={styles.roundCheckbox}
                />
              </div>

              <div
                className={styles.notePreview}
                dangerouslySetInnerHTML={{ __html: sanitizeAndTrimNote(note.note) }}
              />
              <p className={styles.date}>{formatDate(note.dateTime)}</p>

              {note.subject && (
                <div className={styles.subjectBanner}>
                  <span
                    className={styles.subjectCircle}
                    style={{ backgroundColor: getUniqueSubjectColor(note.subject) }}
                  />
                  {note.subject}
                </div>
              )}
            </div>

            {index < notes.length - 0 && <div className={styles.divider}></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetNotes;
