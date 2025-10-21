import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useGetAllEnums } from "../../goalplanner/hooks/useGetAllEnums";
import { useSetUserSubjectPreferencesExistingGrade } from "../hooks/useSetUserSubjectPreferencesExistingGrades";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";
import Summary from "./Summary";
import styles from "./UserGrades.module.css";

import type { RootState } from "../../../redux/store";
import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject";
import type { AddSubjectPreferencesGradeDTO } from "../types/addSubjectPreferenceGradeDTO";
import type { AddSubjectPreferencesGradeResponse } from "../types/addSubjectPreferenceGradeResponse"; 

export function UserGrades() {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const { data: gradeData, isLoading: gradesLoading, error: gradesError } = useGetAllEnums();
  const { mutate } = useSetUserSubjectPreferencesExistingGrade();

  const subjects: GradedSubject[] = persistedPrefs.gradedSubjects ?? [];

  // 🔹 Initiera selectedGrades direkt
  const initialSelectedGrades: Record<string, string> = {};
  subjects.forEach((s) => {
    if (s.grade) initialSelectedGrades[s.courseCode] = s.grade;
  });
  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>(initialSelectedGrades);

  if (!subjects || subjects.length === 0) return <p>Inga ämnen registrerade.</p>;
  if (gradesLoading) return <p>Laddar betyg...</p>;
  if (gradesError) return <p>Ett fel uppstod: {gradesError.message}</p>;
  if (!gradeData) return <p>Inga betyg tillgängliga.</p>;

  const gradeArray = Object.values(gradeData.grades);

  const handleGradeSelect = (courseCode: string, grade: string) => {
    setSelectedGrades((prev) => ({ ...prev, [courseCode]: grade }));
  };

  const handleSaveGrades = async (): Promise<boolean> => {
    const payload: AddSubjectPreferencesGradeDTO[] = Object.entries(selectedGrades).map(
      ([courseCode, grade]) => ({ courseCode, grade: grade as any })
    );

    try {
      await new Promise<void>((resolve, reject) => {
        mutate(payload, {
          onSuccess: (response: AddSubjectPreferencesGradeResponse) => {
            const updatedSubjects: GradedSubject[] = response.subjects.map((subj) => ({
              ...subj,
              grade: subj.grade ?? selectedGrades[subj.courseCode] ?? null,
            }));

            dispatch(
              setPreferences({
                ...persistedPrefs,
                gradedSubjects: updatedSubjects,
                meritValue: response.meritValue,
              })
            );

            // 🔹 Uppdatera bara selectedGrades utan att trigga ny useEffect
            setSelectedGrades({ ...selectedGrades });

            resolve();
          },
          onError: reject,
        });
      });

      return true;
    } catch (err) {
      console.error("Kunde inte spara betyg:", err);
      return false;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.mainText}>Uppdatera dina nuvarande betyg</div>
        <div className={styles.infoText}>
          När du har sparat dina betyg kommer du att kunna se ditt meritvärde till höger.
        </div>

        {subjects.map((subj) => (
          <PreferenceSection
            key={subj.courseCode}
            title={subj.courseName}
            options={gradeArray.map((g) => ({ name: g, code: g, points: "0" }))}
            selected={selectedGrades[subj.courseCode] ?? null}
            onSelect={(val: string | string[]) => {
              const grade = Array.isArray(val) ? val[0] : val;
              handleGradeSelect(subj.courseCode, grade);
            }}
            multiple={false}
            variant="green"
          />
        ))}
      </div>

      <aside className={styles.summarySidebar}>
        <div className={styles.summaryContainer}>
          <Summary meritValue={persistedPrefs.meritValue ?? null} onSave={handleSaveGrades} />
          <div className={styles.saveButtonWrapper}>
            <AnimatedSaveButton onSave={handleSaveGrades} />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default UserGrades;
