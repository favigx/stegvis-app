import { useGetNotes } from "../hooks/useGetNotes";
import styles from "./GetNotes.module.css";
import { formatDate } from "../../../utils/formatDate";
import { sanitizeAndTrimNote } from "../utils/displayNoteInList";
import { getUniqueSubjectColor } from "../utils/getSubjectColor";

interface GetNotesProps {
  filter?: {
    subject?: string;
    fromDate?: string;
    toDate?: string;
    sortBy?: string;
    ascending?: boolean;
  };
  onSelectNote?: (id: string) => void;
}

function GetNotes({ filter, onSelectNote }: GetNotesProps) {
  const { data: notes, isLoading, error } = useGetNotes(filter);

  if (isLoading) return <p>Laddar anteckningar...</p>;
  if (error) return <p className={styles.error}>{error.message}</p>;

  return (
    <div
      style={{
        maxHeight: "1140px",
        padding: "10px", 
        overflowY: "auto",
  
      }}
    >
    {notes?.map((note) => (
  <div
    key={note.id}
    className={styles.buttonContainer}
    style={{ cursor: onSelectNote ? "pointer" : "default" }}
    onClick={() => onSelectNote?.(note.id)}
  >
   {note.subject && (
  <div
    className={styles.subjectBanner}
    style={{ backgroundColor: getUniqueSubjectColor(note.subject) }}
  >
    {note.subject}
  </div>
)}

    <div
  className={styles.notePreview}
  dangerouslySetInnerHTML={{
    __html: sanitizeAndTrimNote(note.note),
  }}
/>
    <p className={styles.date}>{formatDate(note.dateTime)}</p>
  </div>
))}
    </div>
  );
}

export default GetNotes;
