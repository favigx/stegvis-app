import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { PreferenceSection } from "../../onboarding/components/PreferenceSection";
import { useLoadSkolverketSubjectsForProgram } from "../../onboarding/hooks/useLoadSubjects";
import { useSetUserSubjectPreferences } from "../../studyplanner/hooks/userSetUserSubjectPreferences";

import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { Eraser } from "lucide-react";
import { AnimatedSaveButton } from "../../../layout/AnimatedSaveButton";

import styles from "./EditStudyProfile.module.css"; 

import type { RootState } from "../../../redux/store";
import type { SubjectPreference } from "../../onboarding/types/userPreferences/subjectPreference";
import type { EnumButtonOption } from "../../onboarding/types/props/props";
import type { AddSubjectPreferencesDTO } from "../../studyplanner/types/addSubjectPreferencesDTO";

export default function EditStudyProfileCurrentSubjects() {
  const dispatch = useDispatch();
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const programCode = persistedPrefs.program?.code ?? null;
  const orientation = persistedPrefs.orientation;

  const { data: subjectResponse, isLoading, error } =
    useLoadSkolverketSubjectsForProgram(programCode);

  const { mutate: saveSubjects } = useSetUserSubjectPreferences();

  const [selectedSubjects, setSelectedSubjects] = useState<SubjectPreference[]>(
    persistedPrefs.subjects || []
  );
  const [, setSaved] = useState(false);

  // Uppdatera redux instant när ändringar görs lokalt
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

  // Slå ihop dubletter
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
        Här kan du markera vilka kurser du läser just nu.  
        Expandera ämnena och välj de kurser som gäller för dig.
      </p>

      {/* Actions */}
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
        title="Pågående kurser"
        options={subjectOptions}
        selected={selectedSubjects.map(c => c.courseCode)}
        onCourseSelect={handleCourseSelect}
        multiple
      />
    </div>
  );
}
