import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useLoadSkolverketSubjectsForProgram } from "../../onboarding/hooks/useLoadSubjects";
import { useSetUserGradedSubjects } from "../hooks/useSetUserGradedSubjects";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";
import type { RootState } from "../../../redux/store";
import type { EnumButtonOption } from "../../onboarding/types/props/props";
import UserFinishedSubjectsSummarize from "./UserFinishedSubjectsSummarize";
import styles from "./UserSubjects.module.css";
import type { AddGradedSubjectsDTO } from "../types/addGradedSubjectsDTO";
import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject";

export function UserFinishedSubjects() {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const program = persistedPrefs.program;
  const orientation = persistedPrefs.orientation;
  const programCode = program?.code ?? null;
  const gradedSubjects = persistedPrefs?.gradedSubjects ?? [];

  const { data: subjectResponse, isLoading, error } =
    useLoadSkolverketSubjectsForProgram(programCode);
  const { mutate } = useSetUserGradedSubjects();
  const [saved, setSaved] = useState(false);

  const [selectedSubjects, setSelectedSubjects] = useState<GradedSubject[]>(
    persistedPrefs.subjects || []
  );

  useEffect(() => {
    if (persistedPrefs.gradedSubjects?.length) {
      setSelectedSubjects(persistedPrefs.gradedSubjects);
    }
  }, [persistedPrefs.gradedSubjects]);

  if (!programCode) return <p>Program ej valt.</p>;
  if (isLoading) return <p>Laddar ämnen...</p>;
  if (error) return <p>Ett fel uppstod: {error.message}</p>;
  if (!subjectResponse) return <p>Inga ämnen tillgängliga.</p>;

  // --- Hämta alla ämnen ---
  const foundationSubjects = subjectResponse.program.foundationSubjects?.subjects ?? [];
  const orientationSubjects =
    subjectResponse.program.orientations?.find(o => o.code === orientation?.code)?.subjects ?? [];
  const programSpecificSubjects = subjectResponse.program.programmeSpecificSubjects?.subjects ?? [];
  const allSubjects = [...foundationSubjects, ...orientationSubjects, ...programSpecificSubjects];

  // --- Slå ihop dubbletter på code och kurser ---
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

  // --- Hantera val av kurs ---
  const handleCourseSelect = (courseCode: string) => {
    if (gradedSubjects.some(g => g.courseCode === courseCode)) return;

    const newSelected = [...selectedSubjects];
    const existsIndex = newSelected.findIndex(s => s.courseCode === courseCode);

    if (existsIndex >= 0) {
      newSelected.splice(existsIndex, 1);
    } else {
      const course = uniqueSubjects.flatMap(s => s.courses ?? []).find(c => c.code === courseCode);
      if (!course) return;

      newSelected.push({
        courseName: course.name,
        courseCode: course.code,
        coursePoints: Number(course.points ?? 0),
      });
    }

    setSelectedSubjects(newSelected);
  };

  const handleSave = async (): Promise<boolean> => {
    if (selectedSubjects.length === 0) return false;

    const payload: AddGradedSubjectsDTO = selectedSubjects.map(subject => ({
      courseName: subject.courseName,
      courseCode: subject.courseCode,
      coursePoints: subject.coursePoints,
    }));

    try {
      await new Promise<void>((resolve, reject) => {
        mutate(payload, {
          onSuccess: () => {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

            dispatch(setPreferences({
              ...persistedPrefs,
              gradedSubjects: selectedSubjects,
            }));

            setSelectedSubjects([...selectedSubjects]);
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
      {/* 🧭 Vänsterkolumn */}
      <div className={styles.main}>
        <div className={styles.mainText}>Avklarade kurser</div>
        <div className={styles.infoText}>
          Lägg in de kurser du redan har betyg i och uppdatera betygen i betyg och meritvärde.
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

      {/* 🧭 Höger-sidebar */}
      <aside className={styles.summarySidebar}>
        <div className={styles.summaryContainer}>
          <UserFinishedSubjectsSummarize selectedSubjects={selectedSubjects} />
          <div className={styles.saveButtonWrapper}>
            <AnimatedSaveButton onSave={handleSave} />
          </div>
        </div>
      </aside>
    </div>
  );
}

export default UserFinishedSubjects;
