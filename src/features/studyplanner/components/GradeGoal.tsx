import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useGetAllEnums } from "../../goalplanner/hooks/useGetAllEnums";
import { useSetUserGradeGoal } from "../hooks/useSetUserGradeGoal"; 
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";
import type { RootState } from "../../../redux/store";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";
import type { AddGradeGoalDTO } from "../types/addGradeGoalDTO";
import type { AddGradeGoalResponse } from "../types/addGradeGoalResponse";

import GradeGoalSummaryBox from "./GradeGoalSummaryBox";
import styles from './UserGrades.module.css';

export function GradeGoal() {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const { data: gradeData, isLoading: gradesLoading, error: gradesError } = useGetAllEnums();
  const { mutate } = useSetUserGradeGoal(); 

  const subjects: SubjectPreference[] = persistedPrefs.subjects ?? [];

  // 🔹 Initiera state direkt från Redux (endast en gång)
  const initialSelectedGrades: Record<string, string> = {};
  subjects.forEach(subj => {
    if (subj.gradeGoal) initialSelectedGrades[subj.courseCode] = subj.gradeGoal;
  });
  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>(initialSelectedGrades);
  const [meritValueBasedOnGoal, setMeritValueBasedOnGoal] = useState<number | null>(
    persistedPrefs.meritValueBasedOnGoal ?? null
  );

  if (!subjects || subjects.length === 0) return <p>Inga ämnen registrerade.</p>;
  if (gradesLoading) return <p>Laddar betygsenum...</p>;
  if (gradesError) return <p>Ett fel uppstod: {gradesError.message}</p>;
  if (!gradeData) return <p>Inga betyg tillgängliga.</p>;

  const gradeArray = Object.values(gradeData.grades);

  const handleGradeSelect = (courseCode: string, grade: string) => {
    setSelectedGrades(prev => ({ ...prev, [courseCode]: grade }));
  };

  const handleSaveGrades = async (): Promise<boolean> => {
    const payload: AddGradeGoalDTO[] = Object.entries(selectedGrades).map(
      ([courseCode, gradeGoal]) => ({ courseCode, gradeGoal })
    );

    try {
      await new Promise<void>((resolve, reject) => {
        mutate(payload, {
          onSuccess: (response: AddGradeGoalResponse) => {
            const updatedSubjects: SubjectPreference[] = response.subjects.map(subj => {
              const persistSubject = subjects.find(s => s.courseCode === subj.courseCode);
              return {
                ...subj,
                grade: subj.grade ?? persistSubject?.grade,
                gradeGoal: selectedGrades[subj.courseCode] ?? undefined,
                courseName: subj.courseName,
                courseCode: subj.courseCode,
                coursePoints: subj.coursePoints,
              };
            });

            dispatch(setPreferences({
              ...persistedPrefs,
              subjects: updatedSubjects,
              meritValueBasedOnGoal: response.meritValueBasedOnGoal ?? null,
            }));

            // 🔹 Uppdatera state direkt från response
            const newSelected: Record<string, string> = {};
            updatedSubjects.forEach(subj => {
              if (subj.gradeGoal) newSelected[subj.courseCode] = subj.gradeGoal;
            });
            setSelectedGrades(newSelected);
            setMeritValueBasedOnGoal(response.meritValueBasedOnGoal ?? null);
            resolve();
          },
          onError: (err) => reject(err),
        });
      });

      return true;
    } catch (err) {
      console.error("Kunde inte spara betygsmål:", err);
      return false;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.mainText}>Uppdatera dina betygsmål</div>
        <div className={styles.infoText}>
          Sätt upp dina mål och följ dina framsteg! Här ser du dina nuvarande betyg och kan ange vilka mål du vill nå. Spara dina mål för att enkelt kunna följa din utveckling över tid.
        </div>

        {subjects.map(subj => (
          <PreferenceSection
            key={subj.courseCode}
            title={subj.courseName}
            options={gradeArray.map(g => ({ name: g, code: g, points: "0" }))}
            selected={selectedGrades[subj.courseCode] ?? undefined}
            currentGrade={subj.grade ?? undefined}
            onSelect={(val: string | string[]) => {
              const grade = Array.isArray(val) ? val[0] : val;
              handleGradeSelect(subj.courseCode, grade);
            }}
            multiple={false}
          />
        ))}
      </div>

      <aside className={styles.summarySidebar}>
        <div className={styles.summaryContainer}>
          <GradeGoalSummaryBox
            meritValue={meritValueBasedOnGoal}
            onSave={handleSaveGrades}
          />
          <div className={styles.saveButtonWrapper}>
            <AnimatedSaveButton onSave={handleSaveGrades} />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default GradeGoal;
