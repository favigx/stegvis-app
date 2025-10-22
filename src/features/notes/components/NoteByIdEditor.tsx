import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { AddTaskButtons } from "../../deadline/components/add-task/AddTaskbuttons";
import { RichTextEditor } from "./RichTextEditor";
import { AddNoteToolbar } from "./AddNoteToolbar";
import { X } from "lucide-react";
import styles from "./AddNote.module.css";
import { useEditNote } from "../hooks/useEditNote";
import type { EditNoteDTO } from "../types/editNoteDTO";

interface NoteByIdEditorProps {
  noteId: string;
  initialSubject: string;
  initialNote: string;
  onClose?: () => void;
}

export function NoteByIdEditor({
  noteId,
  initialSubject,
  initialNote,
  onClose,
}: NoteByIdEditorProps) {
  const userPrefs = useSelector((state: RootState) => state.preferences);
  const subjects = userPrefs.subjects || [];
  const subjectNames = Array.isArray(subjects)
    ? subjects.map((s) => (typeof s === "string" ? s : s.courseName))
    : [];

  const [subject, setSubject] = useState(initialSubject);
  const [noteContent, setNoteContent] = useState(initialNote);
  const [collapsed, setCollapsed] = useState(!!initialSubject);

  const { editNote, isLoading, status, isError, error } = useEditNote();

  // Automatisk sparande vid ändringar
  useEffect(() => {
    editNote(noteId, { subject, note: noteContent } as EditNoteDTO);
  }, [subject, noteContent, noteId]);

  useEffect(() => {
    setCollapsed(!!subject);
  }, [subject]);

  const handleSave = () => {
    editNote(noteId, { subject, note: noteContent } as EditNoteDTO);
  };

  return (
    <div className={styles.outerContainer}>
      <div className={`${styles.headerBox} ${!collapsed ? styles.open : ""}`}>
        {!collapsed && (
          <AddTaskButtons
            title="Välj ämne"
            options={subjectNames}
            selected={subject}
            onSelect={setSubject}
          />
        )}
      </div>
      <div className={styles.collapseWrapper}>
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "Välj ämne" : <X size={20} />}
        </button>
      </div>
      <div
        className={`${styles.innerContainer} ${
          !collapsed ? styles.shrunk : ""
        }`}
      >
        <AddNoteToolbar
          subject={subject}
          note={noteContent}
          onSave={handleSave}
          onClose={onClose || (() => setNoteContent(""))}
        />

        <AddTaskButtons
          title=""
          options={collapsed ? null : subjectNames}
          selected={subject}
          onSelect={setSubject}
          collapsed={true}
        />

        <div className={styles.horizontalDivider}></div>

        <RichTextEditor content={noteContent} onChange={setNoteContent} />

        <p style={{ fontSize: "0.8rem", color: "#aaa", marginTop: "0.5rem" }}>
          {isLoading && "Sparar..."}
          {status === "success" && "Sparad"}
          {isError && error?.message && `Fel vid sparning: ${error.message}`}
        </p>
      </div>
    </div>
  );
}
