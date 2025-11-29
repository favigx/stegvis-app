import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useLoadSkolverketSubjectsForProgram } from "../../onboarding/hooks/useLoadSubjects";
import { useSetUserGradedSubjects } from "../../studyplanner/hooks/useSetUserGradedSubjects"; 
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { ArrowBigRight, Eraser } from "lucide-react";
import type { RootState } from "../../../redux/store";
import type { EnumButtonOption } from "../../onboarding/types/props/props";
import type { AddGradedSubjectsDTO } from "../../studyplanner/types/addGradedSubjectsDTO"; 
import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton"; 

import styles from "../components/Onboarding.module.css";

interface OnboardingSubjectsProps {
  onComplete?: () => void;
}

export function OnboardingSubjects({ onComplete }: OnboardingSubjectsProps) {  
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const program = persistedPrefs.program;
  const orientation = persistedPrefs.orientation;
  const programCode = program?.code ?? null;

  const { data: subjectResponse, isLoading, error } =
    useLoadSkolverketSubjectsForProgram(programCode);

  const { mutateAsync } = useSetUserGradedSubjects();

  const [selectedSubjects, setSelectedSubjects] = useState<GradedSubject[]>([]);
  const [coursesSaved, setCoursesSaved] = useState(false);

  useEffect(() => {
    setSelectedSubjects(persistedPrefs.gradedSubjects || []);
    setCoursesSaved(false);
  }, [persistedPrefs.gradedSubjects]);

  if (!programCode) return <p>Program ej valt.</p>;
  if (isLoading) return <p>Laddar ämnen...</p>;
  if (error) return <p>Ett fel uppstod: {error.message}</p>;
  if (!subjectResponse) return <p>Inga ämnen tillgängliga.</p>;

  const foundationSubjects = subjectResponse.program.foundationSubjects?.subjects ?? [];
  const orientationSubjects =
    subjectResponse.program.orientations?.find(o => o.code === orientation?.code)?.subjects ?? [];
  const programSpecificSubjects = subjectResponse.program.programmeSpecificSubjects?.subjects ?? [];

  const allSubjects = [...foundationSubjects, ...orientationSubjects, ...programSpecificSubjects];

  const subjectMap: Record<string, typeof allSubjects[0]> = {};
  allSubjects.forEach(subject => {
    if (!subjectMap[subject.code]) {
      subjectMap[subject.code] = { ...subject, courses: subject.courses ? [...subject.courses] : [] };
    } else {
      const existingCourses = subjectMap[subject.code].courses ?? [];
      const newCourses =
        subject.courses?.filter(c => !existingCourses.some(ec => ec.code === c.code)) ?? [];
      subjectMap[subject.code].courses = [...existingCourses, ...newCourses];
    }
  });

  const uniqueSubjects = Object.values(subjectMap);

  const subjectOptions: EnumButtonOption[] = uniqueSubjects.map(subject => ({
    name: subject.name,
    code: subject.code,
    courses: subject.courses?.map(course => ({
      name: course.name,
      code: course.code,
      points: course.points ?? "0",
    })) ?? [],
  }));

  const handleCourseSelect = (courseCode: string) => {
    const exists = selectedSubjects.some(s => s.courseCode === courseCode);

    const course = uniqueSubjects.flatMap(s => s.courses ?? []).find(c => c.code === courseCode);
    if (!course) return;

    const newSelected = exists
      ? selectedSubjects.filter(s => s.courseCode !== courseCode)
      : [
          ...selectedSubjects,
          {
            courseName: course.name,
            courseCode: course.code,
            coursePoints: Number(course.points ?? 0),
          },
        ];

    setSelectedSubjects(newSelected);

    dispatch(
      setPreferences({
        ...persistedPrefs,
        gradedSubjects: newSelected,
      })
    );
  };

  const handleReset = () => {
    setSelectedSubjects([]);
    setCoursesSaved(false);

    dispatch(
      setPreferences({
        ...persistedPrefs,
        gradedSubjects: [],
      })
    );
  };

  const handleSave = async (): Promise<boolean> => {
    if (selectedSubjects.length === 0) return false;

    const payload: AddGradedSubjectsDTO = selectedSubjects.map(s => ({
      courseName: s.courseName,
      courseCode: s.courseCode,
      coursePoints: s.coursePoints,
    }));

    try {
      await mutateAsync(payload);
      setCoursesSaved(true);
      dispatch(
        setPreferences({
          ...persistedPrefs,
          gradedSubjects: selectedSubjects,
        })
      );
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={styles.onboardingContainer}>
      <br />
      <p className={styles.hint}>
        <strong>Del 2 av 4: Avklarade ämnen och kurser</strong>
        <br /><br />
        Nu har vi kommit till del två av "komma igång"-processen som handlar om ämnen och kurser!
        <br /><br />
        Som elev i årskurs {persistedPrefs.year} har du avslutade kurser och här i del två behöver vi veta vilka dom är.
        <br /><br />
        Fyll i dessa kurser nedan för att få en korrekt översikt över dina studier.
        <br /><br />
        För att välja en kurs, klicka på ämnet för att expandera och se tillgängliga kurser. Klicka sedan på de kurser du har avslutat för att markera dem. När du är klar, klicka på "Spara val" för att komma vidare.
      </p>

      <p
        className={styles.hintExtra}
        style={{
          textDecoration: coursesSaved ? "line-through" : "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {coursesSaved ? "✅ Steg 4 -" : "🎯 Steg 4 -"} Välj dina avklarade kurser
      </p>

      {coursesSaved && (
        <div className={styles.continueAction} onClick={onComplete}>
          Del 2/4 av komma igång är klar! Klicka här för att fortsätta
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

  <AnimatedSaveButton onSave={handleSave} />
</div>
  
      <PreferenceSection
        title="Ämnen och kurser"
        options={subjectOptions}
        selected={selectedSubjects.map(c => c.courseCode)}
        onCourseSelect={handleCourseSelect}
        multiple
        variant="green"
      />

    
  

      
    </div>
  );
}

export default OnboardingSubjects;