import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useLoadSkolverketSubjectsForProgram } from "../../onboarding/hooks/useLoadSubjects";
import { useSetUserSubjectPreferences } from "../../studyplanner/hooks/userSetUserSubjectPreferences";

import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { ArrowBigRight, Eraser } from "lucide-react";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";

import styles from "../components/Onboarding.module.css";

import type { RootState } from "../../../redux/store";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";
import type { EnumButtonOption } from "../../onboarding/types/props/props";
import type { AddSubjectPreferencesDTO } from "../../studyplanner/types/addSubjectPreferencesDTO";

interface OnboardingSubjectsProps {
  onComplete?: () => void;
}

export default function OnboardingCurrentSubjects({ onComplete }: OnboardingSubjectsProps) {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const program = persistedPrefs.program;
  const orientation = persistedPrefs.orientation;
  const programCode = program?.code ?? null;

  const { data: subjectResponse, isLoading, error } =
    useLoadSkolverketSubjectsForProgram(programCode);

  const { mutate: saveSubjects } = useSetUserSubjectPreferences();

  const [selectedSubjects, setSelectedSubjects] = useState<SubjectPreference[]>(
    persistedPrefs.subjects || []
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    dispatch(
      setPreferences({
        ...persistedPrefs,
        subjects: [...selectedSubjects],
      })
    );
    setSaved(false);
  }, [selectedSubjects]);

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
    courses:
      subject.courses?.map(course => ({
        name: course.name,
        code: course.code,
        points: course.points ?? "0",
      })) ?? [],
  }));

  const handleCourseSelect = (courseCode: string) => {
    const updated = [...selectedSubjects];
    const index = updated.findIndex(s => s.courseCode === courseCode);

    if (index >= 0) {
      updated.splice(index, 1);
    } else {
      const course = uniqueSubjects.flatMap(s => s.courses ?? []).find(c => c.code === courseCode);
      const subject = uniqueSubjects.find(s => s.courses?.some(c => c.code === courseCode));
      if (!course || !subject) return;

      updated.push({
        subjectCode: subject.code,
        courseName: course.name,
        courseCode: course.code,
        coursePoints: Number(course.points ?? 0),
      });
    }

    setSelectedSubjects(updated);
  };

  const handleReset = () => {
    setSelectedSubjects([]);
    setSaved(false);
  };

  const handleSave = async (): Promise<boolean> => {
    if (selectedSubjects.length === 0) return false;

    const payload: AddSubjectPreferencesDTO = selectedSubjects.map(s => ({
      subjectCode: s.subjectCode,
      courseName: s.courseName,
      courseCode: s.courseCode,
      coursePoints: s.coursePoints,
    }));

    try {
      await new Promise<void>((resolve, reject) =>
        saveSubjects(payload, {
          onSuccess: () => {
            dispatch(
              setPreferences({
                ...persistedPrefs,
                subjects: selectedSubjects,
              })
            );

            setSaved(true);
            resolve();
          },
          onError: reject,
        })
      );
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className={styles.onboardingContainer}>
      <p className={styles.hint}>
        <br />
        <strong>
          {persistedPrefs.year === 1
            ? "Del 2 av 2: Registrera pågående kurser"
            : "Del 4 av 4: Registrera pågående kurser"}
        </strong>
        <br /><br />
        Nu är vi framme vid den sista delen! För att Stegvis ska kunna hjälpa dig på bästa sätt,
        behöver vi veta vilka kurser du läser just nu.
        <br /><br />
        Lägg in de kurser du läser just nu. Klicka på alternativet för varje kurs du vill markera.
        När du är klar, klicka på "Spara kurser".
        <br /><br />
        För att välja en kurs, klicka på ämnet för att expandera och se tillgängliga kurser.
        Klicka sedan på de kurser du har avslutat för att markera dem.
        När du är klar, klicka på "Spara val" för att komma vidare.
        <br /><br />
        Dina val kommer att uppdateras direkt i sammanfattningen till vänster.
      </p>

      <p
        className={styles.hintExtra}
        style={{
          textDecoration: saved ? "line-through" : "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {persistedPrefs.year === 1
          ? saved
            ? "✅ Steg 4 -"
            : "🎯 Steg 4 -"
          : saved
          ? "✅ Steg 6 -"
          : "🎯 Steg 6 -"}{" "}
        Markera pågående kurser
      </p>

      {saved && onComplete && (
        <div className={styles.continueAction} onClick={onComplete}>
          Steg {persistedPrefs.year === 1 ? "2 av 2" : "4 av 4"} är klart! Klicka här för att gå vidare
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
      />
    </div>
  );
}