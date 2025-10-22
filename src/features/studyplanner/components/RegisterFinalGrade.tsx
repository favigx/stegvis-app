import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useGetAllEnums } from "../../goalplanner/hooks/useGetAllEnums";
import { useSetUserSubjectPreferencesGrade } from "../hooks/useSetUserSubjectPreferencesGrade"; 
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";
import type { RootState } from "../../../redux/store";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";
import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject";
import type { AddGradeForCurrentDTO } from "../types/addGradeForCurrentDTO";

import RegisterFinalGradeSummaryBox from "./RegisterFinalGradeSummaryBox";
import styles from './UserGrades.module.css';

export function RegisterFinalGrade() {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const { data: gradeData, isLoading: gradesLoading, error: gradesError } = useGetAllEnums();
  const { mutate } = useSetUserSubjectPreferencesGrade(); 

  const subjects: SubjectPreference[] = persistedPrefs.subjects ?? [];

  // 🔹 Initiera state direkt från Redux
  const initialSelectedGrades: Record<string, string> = {};
  subjects.forEach(s => {
    if (s.grade) initialSelectedGrades[s.courseCode] = s.grade;
  });
  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>(initialSelectedGrades);
  const [celebrateCourse, setCelebrateCourse] = useState<string | null>(null);

  if (!subjects || subjects.length === 0) return <p>Inga ämnen registrerade.</p>;
  if (gradesLoading) return <p>Laddar betygsenum...</p>;
  if (gradesError) return <p>Ett fel uppstod: {gradesError.message}</p>;
  if (!gradeData) return <p>Inga betyg tillgängliga.</p>;

  const gradeArray = Object.values(gradeData.grades);

  const handleGradeSelect = (courseCode: string, grade: string) => {
    setSelectedGrades(prev => ({ ...prev, [courseCode]: grade }));

    const subject = subjects.find(s => s.courseCode === courseCode);
    if (subject?.gradeGoal && subject.gradeGoal === grade) {
      setCelebrateCourse(courseCode);
      setTimeout(() => setCelebrateCourse(null), 3000);
    }
  };

  const handleSaveGrades = async (): Promise<boolean> => {
    const payload: AddGradeForCurrentDTO[] = Object.entries(selectedGrades).map(
      ([courseCode, grade]) => ({ courseCode, grade: grade as any })
    );

    try {
      await new Promise<void>((resolve, reject) => {
        mutate(payload, {
          onSuccess: () => {
            const updatedSubjects: SubjectPreference[] = (persistedPrefs.subjects ?? []).map(subj => ({
              ...subj,
              grade: selectedGrades[subj.courseCode] ?? subj.grade ?? null,
            }));

            const updatedGradedSubjectsMap: Record<string, GradedSubject> = {};
            (persistedPrefs.gradedSubjects ?? []).forEach(g => {
              updatedGradedSubjectsMap[g.courseCode] = { ...g };
            });
            Object.entries(selectedGrades).forEach(([courseCode, grade]) => {
              const subj = updatedSubjects.find(s => s.courseCode === courseCode);
              if (!subj) return;
              updatedGradedSubjectsMap[courseCode] = {
                courseCode,
                courseName: subj.courseName,
                coursePoints: subj.coursePoints ?? 0,
                grade,
              };
            });

            const updatedGradedSubjects = Object.values(updatedGradedSubjectsMap);

            dispatch(setPreferences({
              ...persistedPrefs,
              subjects: updatedSubjects,
              gradedSubjects: updatedGradedSubjects,
            }));

            // 🔹 Uppdatera state direkt
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
        <div className={styles.mainText}>Registrera slutbetyg</div> 
        <div className={styles.infoText}>
          När du har sparat dina betyg kommer du att kunna se dem i betyg och meritvärde.
        </div>

        {subjects.map(subj => (
          <div key={subj.courseCode} className={styles.subjectWrapper}>
            {celebrateCourse === subj.courseCode && (
              <div className={styles.celebrateMessage}>🎉 Grattis! Målet uppnått! 🎉</div>
            )}
            <PreferenceSection
              title={subj.courseName}
              options={gradeArray.map(g => ({ name: g, code: g, points: "0" }))}
              selected={selectedGrades[subj.courseCode] ?? null}
              currentGrade={subj.gradeGoal ?? undefined}
              onSelect={(val: string | string[]) => {
                const grade = Array.isArray(val) ? val[0] : val;
                handleGradeSelect(subj.courseCode, grade);
              }}
              multiple={false}
              variant="default"
            />
          </div>
        ))}
      </div>
      <aside className={styles.summarySidebar}>
        <div className={styles.summaryContainer}>
          <RegisterFinalGradeSummaryBox
            meritValue={persistedPrefs.meritValue ?? null}
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

export default RegisterFinalGrade;