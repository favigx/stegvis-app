import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { AddTaskButtons } from "../../deadline/components/add-task/AddTaskbuttons";
import { RichTextEditor } from "./RichTextEditor";
import { AddNoteToolbar } from "./AddNoteToolbar";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";
import styles from "./AddNote.module.css";

interface AddNoteProps {
  onSave: (subject: string, note: string) => Promise<boolean> | boolean;
  onClose?: () => void;
  subject: string;
  setSubject: React.Dispatch<React.SetStateAction<string>>;
  noteContent: string;
  setNoteContent: React.Dispatch<React.SetStateAction<string>>;
}

export function AddNote({
  onSave,
  onClose,
  subject,
  setSubject,
  noteContent,
  setNoteContent,
}: AddNoteProps) {
  const userPrefs = useSelector((state: RootState) => state.preferences);
  const subjects = userPrefs.subjects || [];

  const subjectNames = Array.isArray(subjects)
    ? subjects.map((s) => (typeof s === "string" ? s : s.courseName))
    : [];

  const [showList, setShowList] = useState(subject ? false : true);

  useEffect(() => {
    setShowList(subject ? false : true);
  }, [subject]);

  const handleClose = () => {
    setSubject("");
    setNoteContent("");
    setShowList(true);
    onClose?.();
  };

  const handleSave = async () => {
    const success = await onSave(subject, noteContent);
    if (success) {
      handleClose();
    }
    return success;
  };

  return (
    <div className={styles.outerContainer}>
      <div className={styles.innerContainer}>
        <AddNoteToolbar
          subject={subject}
          note={noteContent}
          onSave={onSave}
          onClose={handleClose}
        />

        <div className={styles.subjectSelection}>
          {showList ? (
            <div className={styles.subjectListWrapper}>
              <AddTaskButtons
                title=""
                options={subjectNames}
                selected={subject}
                onSelect={(s) => {
                  setSubject(s);
                  setShowList(false);
                }}
                collapsed={false}
              />
            </div>
          ) : (
            <>
              <AddTaskButtons
                title=""
                options={[]}
                selected={subject}
                onSelect={setSubject}
                collapsed={true}
              />
              <button
                className={styles.changeSubjectBtn}
                onClick={() => setShowList(true)}
              >
                Ändra ämne
              </button>
              <div className={styles.saveButtonWrapper}>
                <AnimatedSaveButton onSave={handleSave} />
              </div>
            </>
          )}
        </div>

        <div
          className={`${styles.horizontalDivider} ${
            showList ? styles.expanded : styles.collapsed
          }`}
        />

        <RichTextEditor content={noteContent} onChange={setNoteContent} />
      </div>
    </div>
  );
}
