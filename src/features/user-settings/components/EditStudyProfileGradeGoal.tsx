import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useGetAllEnums } from "../../goalplanner/hooks/useGetAllEnums";
import { useSetUserGradeGoal } from "../../studyplanner/hooks/useSetUserGradeGoal";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { Eraser } from "lucide-react";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";

import styles from "./EditStudyProfile.module.css"; 
import type { RootState } from "../../../redux/store";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";
import type { AddGradeGoalDTO } from "../../studyplanner/types/addGradeGoalDTO";
import type { AddGradeGoalResponse } from "../../studyplanner/types/addGradeGoalResponse";

export default function EditStudyProfileGradeGoal() {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const subjects: SubjectPreference[] = persistedPrefs.subjects ?? [];

  const { data: gradeData, isLoading, error } = useGetAllEnums();
  const { mutateAsync } = useSetUserGradeGoal();

  const initialSelectedGrades: Record<string, string> = Object.fromEntries(
    subjects.filter(s => s.gradeGoal).map(s => [s.courseCode, s.gradeGoal!])
  );

  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>(initialSelectedGrades);
  const [, setGradesSaved] = useState(false);
  const [meritValueBasedOnGoal, setMeritValueBasedOnGoal] = useState<number | null>(
    persistedPrefs.meritValueBasedOnGoal ?? null
  );

  useEffect(() => {
    setGradesSaved(false);

    const updatedSubjects: SubjectPreference[] = subjects.map(subj => ({
      ...subj,
      gradeGoal: selectedGrades[subj.courseCode] ?? subj.gradeGoal ?? undefined,
    }));

    dispatch(
      setPreferences({
        ...persistedPrefs,
        subjects: updatedSubjects,
        meritValueBasedOnGoal,
      })
    );
  }, [selectedGrades]);

  if (subjects.length === 0) return <p>Inga ämnen registrerade.</p>;
  if (isLoading) return <p>Laddar betygsalternativ...</p>;
  if (error) return <p>Ett fel uppstod: {error.message}</p>;
  if (!gradeData) return <p>Inga betyg tillgängliga.</p>;

  const gradeOptions = Object.values(gradeData.grades).map(g => ({
    name: g,
    code: g,
    points: "0",
  }));

  const handleGradeSelect = (courseCode: string, grade: string) => {
    setSelectedGrades(prev => ({
      ...prev,
      [courseCode]: grade,
    }));
  };

  const handleReset = () => {
    setSelectedGrades({});
    setGradesSaved(false);
  };

  const handleSaveGrades = async (): Promise<boolean> => {
    const payload: AddGradeGoalDTO[] = Object.entries(selectedGrades).map(
      ([courseCode, gradeGoal]) => ({ courseCode, gradeGoal })
    );

    try {
      const response: AddGradeGoalResponse = await mutateAsync(payload);

      const updatedSubjects: SubjectPreference[] = subjects.map(subj => ({
        ...subj,
        gradeGoal: selectedGrades[subj.courseCode] ?? subj.gradeGoal ?? undefined,
      }));

      dispatch(
        setPreferences({
          ...persistedPrefs,
          subjects: updatedSubjects,
          meritValueBasedOnGoal: response.meritValueBasedOnGoal ?? null,
        })
      );

      setMeritValueBasedOnGoal(response.meritValueBasedOnGoal ?? null);
      setGradesSaved(true);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={styles.onboardingContainer}>
      <p className={styles.hint}>
        Här kan du sätta mål för vilka betyg du siktar på i dina pågående kurser.
      </p>

      {/* Reset + Save */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <button type="button" className={styles.resetAction} onClick={handleReset}>
          <Eraser size={16} /> Rensa
        </button>
        <AnimatedSaveButton onSave={handleSaveGrades} />
      </div>

      {/* Grade selectors */}
      {subjects.map(subj => (
        <PreferenceSection
          key={subj.courseCode}
          title={subj.courseName}
          options={gradeOptions}
          selected={selectedGrades[subj.courseCode] ?? null}
          onSelect={val =>
            handleGradeSelect(subj.courseCode, Array.isArray(val) ? val[0] : val)
          }
          multiple={false}
        />
      ))}
    </div>
  );
}
