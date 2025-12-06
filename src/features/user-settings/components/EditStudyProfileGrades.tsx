import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useGetAllEnums } from "../../goalplanner/hooks/useGetAllEnums";
import { useSetUserSubjectPreferencesExistingGrade } from "../../studyplanner/hooks/useSetUserSubjectPreferencesExistingGrades";

import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { Eraser } from "lucide-react";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";

import styles from "./EditStudyProfile.module.css"; 

import type { RootState } from "../../../redux/store";
import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject";
import type { AddSubjectPreferencesGradeDTO } from "../../studyplanner/types/addSubjectPreferenceGradeDTO";
import type { AddSubjectPreferencesGradeResponse } from "../../studyplanner/types/addSubjectPreferenceGradeResponse";

interface OnboardingGradesProps {
  onComplete?: () => void;
}

export default function EditStudyProfileGrades({ onComplete }: OnboardingGradesProps) {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const subjects: GradedSubject[] = persistedPrefs.gradedSubjects ?? [];

  const { data: gradeData, isLoading, error } = useGetAllEnums();
  const { mutateAsync } = useSetUserSubjectPreferencesExistingGrade();

  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>(
    Object.fromEntries(subjects.filter(s => s.grade).map(s => [s.courseCode, s.grade!]))
  );

  const [, setGradesSaved] = useState(false);

  if (!subjects.length) return <p>Inga kurser registrerade.</p>;
  if (isLoading) return <p>Laddar betyg...</p>;
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
    setGradesSaved(false);
  };

  const handleReset = () => {
    setSelectedGrades({});
    setGradesSaved(false);
  };

  const handleSaveGrades = async (): Promise<boolean> => {
    const payload: AddSubjectPreferencesGradeDTO[] = Object.entries(selectedGrades).map(
      ([courseCode, grade]) => ({ courseCode, grade })
    );

    try {
      const response: AddSubjectPreferencesGradeResponse = await mutateAsync(payload);

      dispatch(
        setPreferences({
          ...persistedPrefs,
          gradedSubjects: response.subjects,
          meritValue: response.meritValue,
        })
      );

      setGradesSaved(true);
      onComplete?.();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={styles.onboardingContainer}>
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
          variant="green"
        />
      ))}
    </div>
  );
}
