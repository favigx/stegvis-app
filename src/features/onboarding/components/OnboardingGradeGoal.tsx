import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useGetAllEnums } from "../../goalplanner/hooks/useGetAllEnums";
import { useSetUserGradeGoal } from "../../studyplanner/hooks/useSetUserGradeGoal";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { ArrowBigRight, Eraser } from "lucide-react";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";

import styles from "../components/Onboarding.module.css";
import type { RootState } from "../../../redux/store";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";
import type { AddGradeGoalDTO } from "../../studyplanner/types/addGradeGoalDTO";
import type { AddGradeGoalResponse } from "../../studyplanner/types/addGradeGoalResponse"; 
import { useMarkOnboardingComplete } from "../../onboarding/hooks/useMarkOnboardingComplete";

interface GradeGoalProps {
  onComplete?: () => void;
}

export default function OnboardingGradeGoal({ onComplete }: GradeGoalProps) {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);
  const subjects: SubjectPreference[] = persistedPrefs.subjects ?? [];

  const { mutate: markOnboardingComplete } = useMarkOnboardingComplete();

  const { data: gradeData, isLoading, error } = useGetAllEnums();
  const { mutateAsync } = useSetUserGradeGoal();

  const initialSelectedGrades: Record<string, string> = Object.fromEntries(
    subjects.filter(s => s.gradeGoal).map(s => [s.courseCode, s.gradeGoal!])
  );

  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>(initialSelectedGrades);
  const [gradesSaved, setGradesSaved] = useState(false);
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
  if (isLoading) return <p>Laddar betygsenum...</p>;
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
        <br />
        <strong>Några sista ord</strong>
        <br /><br />
        Snyggt! Du har nu slutfört din studieprofil! All information du har angett kommer att användas för att
        skräddarsy din upplevelse i Stegvis.
        <br /><br />
        Vi vill också ge dig möjligheten att nu direkt ange dina betygsmål för de pågående kurser du har registrerat. Fundera en stund på vilka betyg du siktar på att uppnå. Dina betygsmål hjälper oss att anpassa dina
        rekommendationer och planering för att maximera din studietid och framgång. Du kan alltid justera dessa mål senare i inställningarna i din studieprofil.
        <br /><br />
         Välj betygsmål för varje kurs nedan genom att klicka på alternativet. När du är klar, klicka på "Spara betyg".
          <br /><br />
          Om du inte vill sätta betygsmål just nu, kan du helt enkelt klicka på knappen "Ta mig till startsidan".
        <br /><br />
<button
  type="button"
  onClick={() => markOnboardingComplete()}
  style={{
    marginBottom: "20px",
    backgroundColor: "#007bff",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "15px",
    fontWeight: 600,
  }}
>
  Ta mig till startsidan
  <ArrowBigRight size={20} />
</button>
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
        {gradesSaved
          ? `✅ Steg ${persistedPrefs.year === 1 ? "3" : "5"} - `
          : `🎯 Steg ${persistedPrefs.year === 1 ? "3" : "5"} - `} 
        Markera betygsmål (valfritt)
      </p>

      {gradesSaved && onComplete && (
        <div className={styles.continueAction} onClick={onComplete}>
          Steg {persistedPrefs.year === 1 ? "2 av 2" : "3 av 4"} är klart! Klicka här för att gå vidare
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
       
        />
      ))}
    </div>
  );
}