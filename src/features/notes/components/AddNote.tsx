import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { AddTaskButtons } from "../../deadline/components/add-task/AddTaskbuttons"; 
import { addNote } from "../api/notesAPI";
import type { AddNoteDTO } from "../types/addNoteDTO";
import containerStyles from "../../../layout/Container.module.css";
import { RichTextEditor } from "./RichTextEditor"; 

export function AddNote({ onNoteAdded }: { onNoteAdded?: () => void }) {
  const userPrefs = useSelector((state: RootState) => state.preferences);
  const subjects = userPrefs.subjects || [];

  const [subject, setSubject] = useState<string>(subjects?.[0] || "");
  const [noteContent, setNoteContent] = useState<string>("");

  const handleSave = async () => {
    if (!subject || !noteContent.trim()) return;

    const dto: AddNoteDTO = { subject, note: noteContent };

    try {
      await addNote(dto);
      if (onNoteAdded) onNoteAdded();
      setNoteContent("");
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  return (
    <div className={containerStyles.mainContainer}>
      <h3>Ny anteckning</h3>

      <div>
        <AddTaskButtons
          title="Ämne"
          options={subjects}
          selected={subject}
          onSelect={setSubject}
        />
      </div>

      {/* Editor */}
      <div>
        <RichTextEditor content={noteContent} onChange={setNoteContent} />
      </div>

      <div className={containerStyles.saveWrapper}>
        <button className={containerStyles.saveBtn} onClick={handleSave}>
          Lägg till anteckning
        </button>
      </div>
    </div>
  );
}