import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import styles from './AddTask.module.css';
import { LoadCalenderEnums } from "../enums/Enum";
import { AddTaskButtons } from "./AddTaskbuttons";
import { addTask } from "../../../api/calender/task/task";
import type { AddTaskDTO } from "../../../interfaces/calender/task/dto/addTask";
import { registerLocale } from "react-datepicker";
import { sv } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
registerLocale("sv", sv);
import "react-datepicker/dist/react-datepicker.css";

import { AddTaskDatePickerButton } from "./AddTaskDatePicker";
import styless from './AddTaskButtons.module.css';

interface AddTaskProps {
  onTaskAdded?: () => void;
}

export function AddTask({ onTaskAdded }: AddTaskProps) {
  const enums = useSelector((state: RootState) => state.calenderenums);
  const userPrefs = useSelector((state: RootState) => state.preferences);

  const [subject, setSubject] = useState<string>(userPrefs.subjects?.[0] || "");
  const [type, setType] = useState<string>(enums?.types?.[0] || "");
  const [deadline, setDeadline] = useState<Date | null>(null);

  if (!enums || !userPrefs) return <p>Laddar...</p>;

  const handleSave = async () => {
    if (!subject || !type || !deadline) return;

    const dto: AddTaskDTO = {
      subject,
      type: type.toUpperCase(),
      deadline: deadline.toISOString(),
    };
    try {
      const response = await addTask(dto);
      console.log("Task saved successfully:", response);
      if (onTaskAdded) onTaskAdded();
    } catch (err) {
      console.error("Failed to save task:", err);
    }
  };

  return (
    <div className={styles.onboardingWrapper}>
      <div className={styles.onboardingContainer}>
        <h3>Skapa ny deadline</h3>
        <LoadCalenderEnums />
        <AddTaskButtons
          title="Ämne"
          options={userPrefs.subjects || []}
          selected={subject}
          onSelect={setSubject}
        />
        <AddTaskButtons
          title="Typ"
          options={enums.types}
          selected={type}
          onSelect={setType}
        />
        <AddTaskDatePickerButton
          title="Deadline"
          selected={deadline}
          onSelect={setDeadline}
        />
        <button className={styless.savePrefBtn} onClick={handleSave}>Lägg till deadline</button>
      </div>
    </div>
  );
}