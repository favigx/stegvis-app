import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";

import { useNoteById } from "../hooks/useNoteById";
import { useDeleteNote } from "../hooks/useDeleteNote";
import { useOptimizeNote } from "../hooks/noteCollections.ts/useOptimizeNote";
import { useEditNote } from "../hooks/useEditNote";
import { useGenerateNoteQuiz } from "../hooks/noteCollections.ts/useGenerateNoteQuiz";
import { NoteToolbar } from "./NoteToolbar";
import { RichTextEditorToolbar } from "./RichTextEditorToolbar";
import { AddTaskButtons } from "../../deadline/components/add-task/AddTaskbuttons";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";

import styles from "./NoteById.module.css";

interface NoteByIdProps {
  noteId: string;
  noteContent?: string;
  onClose?: () => void;
}

export function NoteById({ noteId, noteContent = "", onClose }: NoteByIdProps) {
  const { data: note, isLoading, error } = useNoteById(noteId);
  const queryClient = useQueryClient();
  const deleteNoteMutation = useDeleteNote();
  const { optimizedNote, isLoading: optimizing, optimizeNote } = useOptimizeNote();
  const { editNote } = useEditNote();
  const { generateQuiz, isLoading: generating } = useGenerateNoteQuiz();
  const navigate = useNavigate();

  const userPrefs = useSelector((state: RootState) => state.preferences);
  const subjects = userPrefs.subjects || [];
  const subjectNames = Array.isArray(subjects)
    ? subjects.map((s) => (typeof s === "string" ? s : s.courseName))
    : [];

  const [subject, setSubject] = useState(note?.subject || "");
  const [collapsed, setCollapsed] = useState(!!note?.subject);
  const [isEditing, setIsEditing] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Collapsed när subject ändras
  useEffect(() => {
    setCollapsed(!!subject);
  }, [subject]);

  // Initiera editor
  useEffect(() => {
    const newEditor = new Editor({
      extensions: [StarterKit],
      content: noteContent || note?.note || "",
    });
    setEditor(newEditor);
    return () => newEditor.destroy();
  }, [noteContent, note?.note]);

  // Uppdatera editor automatiskt när optimerad note kommer
  useEffect(() => {
    if (editor && optimizedNote?.id === noteId) {
      editor.commands.setContent(optimizedNote.note);
      editor.view?.dispatch(editor.view.state.tr.scrollIntoView());
    }
  }, [optimizedNote, editor, noteId]);

  const handleSave = async (): Promise<boolean> => {
    if (!editor) return false;
    try {
      const html = editor.getHTML();
      await editNote(noteId, { subject, note: html });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      return true;
    } catch (err) {
      console.error("Misslyckades med att spara anteckning:", err);
      return false;
    }
  };

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    deleteNoteMutation.mutate(noteId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["notesCount"] });
        onClose?.();
      },
      onError: console.error,
    });
  };

  const handleOptimize = () => {
    if (!note) return;
    const selectedCourse = subjects.find(
      (s) => s.courseName === note.subject || s.courseCode === note.subject
    );
    if (!selectedCourse) return;
    optimizeNote(noteId, selectedCourse.subjectCode, selectedCourse.courseCode);
  };

  const handleGenerateQuiz = () => {
    if (!note) return;

    generateQuiz(noteId, {
      onSuccess: (quiz) => {
        const playNow = window.confirm("Quizet är klart! Vill du spela det nu?");
        if (playNow) navigate(`/quiz/${quiz.id}`);
      },
      onError: console.error,
    });
  };

  if (isLoading && !noteContent) return <p>Laddar anteckning...</p>;
  if (error) return <p>Fel: {error.message}</p>;
  if (!noteContent && !note?.note) return <p>Ingen anteckning hittades</p>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={noteId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={styles.outerContainer}
      >
        <div className={styles.innerContainer}>
          <NoteToolbar
            onDelete={handleDelete}
            onToggleEdit={() => setIsEditing((prev) => !prev)}
            onClose={onClose ?? (() => {})}
            onOptimize={handleOptimize}
            onGenerateQuiz={handleGenerateQuiz}
            isEditing={isEditing}
            isDeleting={false}
          />

          <div className={styles.subjectSelection}>
            <AddTaskButtons
              title=""
              options={isEditing ? subjectNames : []}
              selected={subject}
              onSelect={isEditing ? setSubject : () => {}}
              collapsed={!isEditing || collapsed}
            />

            {isEditing && collapsed && (
              <button
                className={styles.changeSubjectBtn}
                onClick={() => setCollapsed(false)}
              >
                Ändra ämne
              </button>
            )}
          </div>

          {isEditing && editor && <RichTextEditorToolbar editor={editor} />}

          {isEditing && (
            <div
              className={`${styles.horizontalDivider} ${
                collapsed ? styles.collapsed : styles.expanded
              }`}
            />
          )}

          {optimizing && <p>Optimerar anteckning...</p>}
          {generating && <p>Genererar quiz...</p>}

          {editor && (
            <div className={styles.textareaContainer}>
              <div className={styles.textarea}>
                <div
                  ref={(el) => {
                    if (!el || !editor) return;
                    if (!el.contains(editor.view.dom)) {
                      el.appendChild(editor.view.dom);
                    }
                    editor.setEditable(isEditing);
                  }}
                />
              </div>
            </div>
          )}

          {isEditing && (
            <div className={styles.toolbarContainer}>
              <AnimatedSaveButton
                onSave={async () => {
                  const success = await handleSave();
                  if (success) setIsEditing(false);
                  return success;
                }}
              />
              <button
                className={styles.iconButton}
                onClick={() => setIsEditing(false)}
              >
                <X size={16} /> Avbryt
              </button>
            </div>
          )}

          {showDeleteConfirm && (
            <div className={styles.modalOverlay}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={styles.modalContent}
              >
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
                  <button onClick={() => setShowDeleteConfirm(false)}>Nej</button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
