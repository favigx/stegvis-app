import { useNoteById } from "../hooks/useNoteById";
import { XCircle } from "lucide-react";
import styles from "./NoteById.module.css";
import { getUniqueSubjectColor } from "../utils/getSubjectColor";

interface NoteByIdProps {
  noteId: string;
  onClose?: () => void;
}

export function NoteById({ noteId, onClose }: NoteByIdProps) {
  const { data: note, isLoading, error } = useNoteById(noteId);

  if (isLoading) return <p>Laddar anteckning...</p>;
  if (error) return <p>Fel: {error.message}</p>;
  if (!note) return <p>Ingen anteckning hittades</p>;

  const subjectColor = getUniqueSubjectColor(note.subject);

  return (
    <div >
      {onClose && (
        <button
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={onClose}
        >
          <XCircle size={24} color="#fff" />
        </button>
      )}

      <div >
{note.subject && (
  <div
   style={{
  position: "absolute",
  top: "13px",
  left: "360px",              
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "12px 24px",
  borderRadius: "50px",
  backgroundColor: subjectColor,
  backdropFilter: "blur(2px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  border: "2px solid #e6e3e3ff",
  fontWeight: 600,
  color: "#ffffffff",
  maxWidth: "300px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}}
  >
    {note.subject}
  </div>
)}

        <div
          className={styles.noteContent}
          dangerouslySetInnerHTML={{ __html: note.note }}
        />
      </div>
    </div>
  );
}