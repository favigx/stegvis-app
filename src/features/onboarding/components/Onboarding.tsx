import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";
import { setUserPreferences, getUserPreferences } from "../api/userPreferences/userPreferencesAPI";
import { setHasCompletedOnboarding } from "../../../redux/slices/authSlice";
import { PreferenceSection } from "./PreferenceSection";
import { Summarize } from "./OnboardingSummarize";
import { useLoadEnums } from "../hooks/useLoadEnums"; 
import { useAppDispatch, useAppSelector, useLoadPrograms } from "../hooks/useLoadPrograms";
import { fetchSubjectsForProgram, resetSubjects } from "../../../redux/slices/subject";
import { mapSubjectsToOptions } from "../utils/mapSubjectsToOptions";
import { StatusOverlay } from "../../../layout/StatusOverlay";
import { Save } from "lucide-react";
import styless from '../../../layout/Container.module.css';

import type { UserPreference } from "../types/userPreferences/userPreferences";
import styles from "./Onboarding.module.css";
import { useSelectionHandler } from "../hooks/useSelectionHandler";
import type { AddUserPreferencesOnboardingDTO } from "../types/userPreferences/addUserPreferencesOnboardingDTO";

export function Onboarding({ 
  title = "Komma igång med Stegvis", 
  buttonText = "Fortsätt", 
  hint = "Du kan alltid ändra dina preferenser i inställningar",
  hint2 = "Ställ in dina preferenser nedan för att få en anpassad upplevelse", 
  redirectPath 
}: any) {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useLoadEnums();
  const { loading: programsLoading, error: programsError, data: programs } = useLoadPrograms();

  const enums = useAppSelector(state => state.enums);
  const userPrefs = useAppSelector(state => state.preferences);
  const subjectsState = useAppSelector(state => state.subjects);
  const programDetails = subjectsState.data;

  useEffect(() => {
    console.log("Programdetails updated:", programDetails);
  }, [programDetails]);

  const [localPrefs, setLocalPrefs] = useState<UserPreference>({
    ...userPrefs,
    educationLevel: userPrefs.educationLevel || "Gymnasiet",
    orientation: userPrefs.orientation || null
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const resp = await getUserPreferences();
        setLocalPrefs({
          ...resp.userPreference,
          educationLevel: resp.userPreference.educationLevel || "Gymnasiet",
          orientation: resp.userPreference.orientation || null
        });
        dispatch(setPreferences(resp.userPreference));
      } catch (err) {
        console.error("Failed to fetch user preferences:", err);
      }
    };
    fetchPreferences();
  }, [dispatch]);

  const updateField = (field: keyof UserPreference, value: any) => {
    setLocalPrefs(prev => ({ ...prev, [field]: value }));

    if (field === "fieldOfStudy" && typeof value === "string") {
      dispatch(resetSubjects());
      const selectedProgram = programs.find(p => `${p.name} (${p.code})` === value);
      if (selectedProgram) {
        dispatch(fetchSubjectsForProgram(selectedProgram.code));
        setLocalPrefs(prev => ({ ...prev, orientation: null }));
      }
    }

    if (field === "orientation") {
      setLocalPrefs(prev => ({ ...prev, subjects: [] }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const payload: AddUserPreferencesOnboardingDTO = {
        educationLevel: localPrefs.educationLevel || "Gymnasiet",
        fieldOfStudy: localPrefs.fieldOfStudy || "",
        orientation: localPrefs.orientation || "",
        year: localPrefs.year || 1,
        subjects: localPrefs.subjects || [],
      };

      await setUserPreferences(payload);
      dispatch(setPreferences(payload));
      setSaved(true);

      setTimeout(() => {
        dispatch(setHasCompletedOnboarding(true));
        setSaving(false);
        if (redirectPath) navigate(redirectPath);
      }, 2000);
    } catch (err) {
      console.error("Failed to save preferences:", err);
      setSaving(false);
    }
  };

  const combinedSubjects = (() => {
    if (!programDetails) return [];

    const subjectsMap: Record<string, any> = {};
    const addSubjects = (list: any[]) => {
      list.forEach(subj => {
        const code = subj.code;
        const courses = subj.courses ?? [];
        if (subjectsMap[code]) {
          const existingCodes = subjectsMap[code].courses.map((c: any) => c.code);
          const newCourses = courses.filter((c: any) => !existingCodes.includes(c.code));
          subjectsMap[code].courses.push(...newCourses);
        } else {
          subjectsMap[code] = { ...subj, courses: [...courses] };
        }
      });
    };

    addSubjects(programDetails.foundationSubjects?.subjects ?? []);
    addSubjects(programDetails.programmeSpecificSubjects?.subjects ?? []);
    if (localPrefs.orientation) {
      const orientation = programDetails.orientations?.find(
        o => o.code === localPrefs.orientation || o.name === localPrefs.orientation
      );
      if (orientation) addSubjects(orientation.subjects ?? []);
    }

    return Object.values(subjectsMap);
  })();

  const orientations = localPrefs.fieldOfStudy ? programDetails?.orientations ?? [] : [];
  const handleSelect = useSelectionHandler(localPrefs.educationLevel, val => updateField("educationLevel", val), false);

  return (
    <div className={styless.mainWrapper} style={{ paddingBottom: '2rem' }}>
      <div className={styless.mainContainer
      }>
        <h3 style={{ position: "absolute", top: -60, left: 0 }}>{title}</h3>

        {(!enums || programsLoading) && <p>Laddar...</p>}
        {programsError && <p>Ett fel inträffade: {programsError}</p>}

        {enums && (
          <>
            <PreferenceSection
              title="Skolnivå"
              options={enums.educationLevels.map(e => ({ name: e, code: e }))}
              selected={localPrefs.educationLevel}
              onSelect={handleSelect}
            />

            {programs.length > 0 && (
              <PreferenceSection
                title="Program"
                options={programs.map(p => ({ name: `${p.name} (${p.code})`, code: `${p.name} (${p.code})` }))}
                selected={localPrefs.fieldOfStudy}
                onSelect={val => updateField("fieldOfStudy", val)}
                searchable
              />
            )}

            {orientations.length > 0 && (
              <PreferenceSection
                title="Inriktning"
                options={orientations.map(o => ({ name: o.name, code: o.code }))}
                selected={localPrefs.orientation}
                onSelect={val => updateField("orientation", val)}
              />
            )}

            <PreferenceSection
              title="År"
              options={enums.year.map((y, i) => ({ name: `${i + 1}`, code: `${i + 1}` }))}
              selected={localPrefs.year ? `${localPrefs.year}` : null}
              onSelect={val =>
                updateField("year", typeof val === "string" ? Number(val) : Number(val[0]))
              }
            />

            {combinedSubjects.length > 0 && (
              <PreferenceSection
                title="Ämnen"
                options={mapSubjectsToOptions(combinedSubjects)}
                selected={localPrefs.subjects}
                onSelect={val => updateField("subjects", val)}
                multiple
              />
            )}
          </>
        )}

        <div className={styles.savePrefWrapper} style={{ position: "relative" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: "transparent",
              border: "none",
              cursor: saving ? "default" : "pointer",
              position: "absolute", 
              top: -705,
              right: -25,
              zIndex: 10,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
           
            }}
          >
            <Save
              size={28}
              color={saving ? "#999" : "#888da8ff"}
              
             
            />
          </button>

          <p>{hint}</p>
        </div>
      </div>

      <div className={styles.summarizeContainer}>
        <Summarize userPrefs={localPrefs} />
      </div>

      <StatusOverlay
        active={saving}
        completed={saved}
        loadingText="Sparar preferenser..."
        doneText="Preferenser sparade!"
      />
    </div>
  );
}
