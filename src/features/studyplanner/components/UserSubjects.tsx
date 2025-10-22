import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useLoadSkolverketSubjectsForProgram } from "../../onboarding/hooks/useLoadSubjects";
import { useSetUserSubjectPreferences } from "../hooks/userSetUserSubjectPreferences";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import UserSubjectsSummary from "./UserSubjectsSummary";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";
import styles from "./UserSubjects.module.css";

import type { RootState } from "../../../redux/store";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";
import type { EnumButtonOption } from "../../onboarding/types/props/props";
import type { AddSubjectPreferencesDTO } from "../types/addSubjectPreferencesDTO";

export function UserSubjects() {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const program = persistedPrefs.program;
  const orientation = persistedPrefs.orientation;
  const programCode = program?.code ?? null;

  const { data: subjectResponse, isLoading, error } =
    useLoadSkolverketSubjectsForProgram(programCode);
  const { mutate } = useSetUserSubjectPreferences();

  const [selectedSubjects, setSelectedSubjects] = useState<SubjectPreference[]>(
    persistedPrefs.subjects || []
  );

  useEffect(() => {
    if (persistedPrefs.subjects?.length) {
      setSelectedSubjects(persistedPrefs.subjects);
    }
  }, [persistedPrefs.subjects]);

  if (!programCode) return <p>Program ej valt.</p>;
  if (isLoading) return <p>Laddar ämnen...</p>;
  if (error) return <p>Ett fel uppstod: {error.message}</p>;
  if (!subjectResponse) return <p>Inga ämnen tillgängliga.</p>;

  // --- Samla unika ämnen ---
  const foundationSubjects = subjectResponse.program.foundationSubjects?.subjects ?? [];
  const orientationSubjects =
    subjectResponse.program.orientations?.find(o => o.code === orientation?.code)?.subjects ?? [];
  const programSpecificSubjects = subjectResponse.program.programmeSpecificSubjects?.subjects ?? [];

  const allSubjects = [...foundationSubjects, ...orientationSubjects, ...programSpecificSubjects];

  // --- Bygg unika ämnen med unika kurser ---
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

  // --- Hantera kursval ---
  const handleCourseSelect = (courseCode: string, _points: number) => {
    const newSelected = [...selectedSubjects];
    const existsIndex = newSelected.findIndex(s => s.courseCode === courseCode);

    if (existsIndex >= 0) {
      // Ta bort om redan valt
      newSelected.splice(existsIndex, 1);
    } else {
      // Hitta kursen
      const course = uniqueSubjects.flatMap(s => s.courses ?? []).find(c => c.code === courseCode);
      if (!course) return;

      // Hitta ämnet kursen tillhör
      const subject = uniqueSubjects.find(s =>
        s.courses?.some(c => c.code === courseCode)
      );
      if (!subject) return;

      newSelected.push({
        subjectCode: subject.code,
        courseName: course.name,
        courseCode: course.code,
        coursePoints: Number(course.points ?? 0),
      });
    }

    setSelectedSubjects(newSelected);
  };

  // --- Spara ---
  const handleSave = async (): Promise<boolean> => {
    if (selectedSubjects.length === 0) return false;

    const payload: AddSubjectPreferencesDTO = selectedSubjects.map(subject => ({
      subjectCode: subject.subjectCode,
      courseName: subject.courseName,
      courseCode: subject.courseCode,
      coursePoints: subject.coursePoints,
    }));

    try {
      await new Promise<void>((resolve, reject) => {
        mutate(payload, {
          onSuccess: () => {
            dispatch(
              setPreferences({
                ...persistedPrefs,
                subjects: selectedSubjects,
              })
            );
            resolve();
          },
          onError: reject,
        });
      });

      return true;
    } catch (err) {
      console.error("Misslyckades med att spara kurser:", err);
      return false;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.mainText}>Pågående kurser</div>
        <div className={styles.infoText}>
          Lägg in de kurser du läser just nu.
        </div>

        <PreferenceSection
          title="Ämnen och kurser"
          options={subjectOptions}
          selected={selectedSubjects.map(c => c.courseCode)}
          onCourseSelect={handleCourseSelect}
          multiple
        />
      </div>

      <aside className={styles.summarySidebar}>
        <div className={styles.summaryContainer}>
          <UserSubjectsSummary selectedSubjects={selectedSubjects} />
          <div className={styles.saveButtonWrapper}>
            <AnimatedSaveButton onSave={handleSave} />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default UserSubjects;
