import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useLoadSkolverketSubjectsForProgram } from "../../onboarding/hooks/useLoadSubjects";
import { useSetUserGradedSubjects } from "../../studyplanner/hooks/useSetUserGradedSubjects";

import { setPreferences } from "../../../redux/slices/userPreferenceSlice";

import type { RootState } from "../../../redux/store";
import type { EnumButtonOption } from "../../onboarding/types/props/props";
import type { AddGradedSubjectsDTO } from "../../studyplanner/types/addGradedSubjectsDTO";
import type { GradedSubject } from "../../onboarding/types/userPreferences/gradedSubject";

import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";
import { Eraser } from "lucide-react";

import styles from "./EditStudyProfile.module.css"; 

export function EditStudyProfileSubjects() {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const program = persistedPrefs.program;
  const orientation = persistedPrefs.orientation;
  const programCode = program?.code ?? null;

  const { data: subjectResponse, isLoading, error } =
    useLoadSkolverketSubjectsForProgram(programCode);

  const { mutateAsync } = useSetUserGradedSubjects();

  const [selectedSubjects, setSelectedSubjects] = useState<GradedSubject[]>([]);

  useEffect(() => {
    setSelectedSubjects(persistedPrefs.gradedSubjects || []);
  }, [persistedPrefs.gradedSubjects]);

  if (!programCode) return <p>Program ej valt.</p>;
  if (isLoading) return <p>Laddar ämnen...</p>;
  if (error) return <p>Ett fel uppstod: {error.message}</p>;
  if (!subjectResponse) return <p>Inga ämnen tillgängliga.</p>;

  // --- SUBJECT MERGING LOGIC ---
  const foundationSubjects = subjectResponse.program.foundationSubjects?.subjects ?? [];
  const orientationSubjects =
    subjectResponse.program.orientations?.find(o => o.code === orientation?.code)?.subjects ?? [];
  const programSpecificSubjects =
    subjectResponse.program.programmeSpecificSubjects?.subjects ?? [];

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

  // --- Select course ---
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

  // --- Reset ---
  const handleReset = () => {
    setSelectedSubjects([]);

    dispatch(
      setPreferences({
        ...persistedPrefs,
        gradedSubjects: [],
      })
    );
  };

  // --- Save ---
  const handleSave = async (): Promise<boolean> => {
    if (selectedSubjects.length === 0) return false;

    const payload: AddGradedSubjectsDTO = selectedSubjects.map(s => ({
      courseName: s.courseName,
      courseCode: s.courseCode,
      coursePoints: s.coursePoints,
    }));

    try {
      await mutateAsync(payload);

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

      {/* Action-knappar */}
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

      {/* Kursväljaren */}
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

export default EditStudyProfileSubjects;
