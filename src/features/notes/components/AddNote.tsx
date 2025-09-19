import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { AddTaskButtons } from "../../deadline/components/add-task/AddTaskbuttons"; 
import { useAddNote } from "../hooks/useAddNote"; 
import type { AddNoteDTO } from "../types/addNoteDTO";
import { RichTextEditor } from "./RichTextEditor"; 
import { Save } from "lucide-react";  
import styles from './AddNote.module.css';
import styless from '../../../layout/Container.module.css'

export function AddNote({ onNoteAdded }: { onNoteAdded?: () => void }) {
  const userPrefs = useSelector((state: RootState) => state.preferences);
  const subjects = userPrefs.subjects || [];

  const [subject, setSubject] = useState<string>(subjects?.[0] || "");
  const [noteContent, setNoteContent] = useState<string>("");

  const addNoteMutation = useAddNote(); 

  const handleSave = () => {
    if (!subject || !noteContent.trim()) return;

    const dto: AddNoteDTO = { subject, note: noteContent };

    addNoteMutation.mutate(dto, {
      onSuccess: () => {
        setNoteContent("");
        if (onNoteAdded) onNoteAdded();
      },
      onError: (err: any) => {
        console.error("Failed to save note:", err.message || err);
      },
    });
  };

  return (
    <div >
      <div>
        <AddTaskButtons
          title="Ämne"
          options={subjects}
          selected={subject}
          onSelect={setSubject}
        />
      </div>
      <div>
        <RichTextEditor content={noteContent} onChange={setNoteContent} />
      </div>

<button
  onClick={handleSave}
  disabled={addNoteMutation.isPending}
  style={{
    background: "transparent",
    border: "none",
    cursor: addNoteMutation.isPending ? "default" : "pointer",
    position: "absolute",
    top: -55,
    right: 9,
  }}
>
  <span className={styless.hologramIcon}>
    <Save
      size={28}
      color={addNoteMutation.isPending ? "#999" : "#ffffffff"}
    />
  </span>
</button>


      {addNoteMutation.isError && (
        <p className={styles.error}>
          {addNoteMutation.error?.message || "Ett fel inträffade"}
        </p>
      )}
    </div>
  );
}
