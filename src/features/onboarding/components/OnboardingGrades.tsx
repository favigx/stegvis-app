import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useGetAllEnums } from "../../goalplanner/hooks/useGetAllEnums";
import { useSetUserSubjectPreferencesExistingGrade } from "../../studyplanner/hooks/useSetUserSubjectPreferencesExistingGrades";

import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { ArrowBigRight, Eraser } from "lucide-react";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";

import styles from "../components/Onboarding.module.css";
import type { RootState } from "../../../redux/store";
import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject";
import type { AddSubjectPreferencesGradeDTO } from "../../studyplanner/types/addSubjectPreferenceGradeDTO";
import type { AddSubjectPreferencesGradeResponse } from "../../studyplanner/types/addSubjectPreferenceGradeResponse";

interface OnboardingGradesProps {
  onComplete?: () => void;
}

export default function OnboardingGrades({ onComplete }: OnboardingGradesProps) {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const subjects: GradedSubject[] = persistedPrefs.gradedSubjects ?? [];

  const { data: gradeData, isLoading, error } = useGetAllEnums();
  const { mutateAsync } = useSetUserSubjectPreferencesExistingGrade();

  const initialGrades: Record<string, string> = Object.fromEntries(
    subjects.filter(s => s.grade).map(s => [s.courseCode, s.grade!])
  );

  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>(initialGrades);
  const [gradesSaved, setGradesSaved] = useState(false);

  useEffect(() => {
    setGradesSaved(false);

    const updatedSubjects: GradedSubject[] = subjects.map(subj => ({
      ...subj,
      grade: selectedGrades[subj.courseCode] ?? subj.grade ?? null,
    }));

    dispatch(
      setPreferences({
        ...persistedPrefs,
        gradedSubjects: updatedSubjects,
      })
    );
  }, [selectedGrades]);

  if (subjects.length === 0) return <p>Inga kurser registrerade.</p>;
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
  };

  const handleReset = () => {
    setSelectedGrades({});
    setGradesSaved(false);
  };

  const handleSaveGrades = async (): Promise<boolean> => {
    const payload: AddSubjectPreferencesGradeDTO[] = Object.entries(selectedGrades).map(
      ([courseCode, grade]) => ({ courseCode, grade: grade as any })
    );

    try {
      const response: AddSubjectPreferencesGradeResponse = await mutateAsync(payload);

      const updatedSubjects: GradedSubject[] = response.subjects.map(subj => ({
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

      setGradesSaved(true);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={styles.onboardingContainer}>
      <p className={styles.hint}>
        <br />
        <strong>Del 3 av 4: Markera slutbetyg för avklarade kurser</strong>
        <br /><br />
        Nu är det dags att ange dina slutbetyg för de kurser som du fyllde i den tidigare delen.
        Välj betyg för varje kurs nedan genom att klicka på alternativet. När du är klar, klicka på "Spara betyg".
        <br /><br/>
        När du har sparat dina betyg kommer du att kunna se ditt uppdaterade jämförelsetal i sammanfattningen till vänster på den här sidan. 
      </p>

      <p
        className={styles.hintExtra}
        style={{
          textDecoration: gradesSaved ? "line-through" : "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {gradesSaved ? "✅ Steg 5 -" : "🎯 Steg 5 -"} Markera slutbetyg för avklarade kurser
      </p>

      {gradesSaved && (
        <div className={styles.continueAction} onClick={onComplete}>
          Steg 3 av 4 är klart! Klicka här för att gå vidare
          <ArrowBigRight size={25} />
        </div>
      )}

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