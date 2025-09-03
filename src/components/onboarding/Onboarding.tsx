import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setPreferences } from "../../redux/slices/userPreferenceSlice";
import { setUserPreferences, getUserPreferences } from "../../api/user/preferences";
import { setHasCompletedOnboarding } from "../../redux/slices/authSlice";
import { PreferenceSection } from "./PreferenceSection";
import { LoadEnums } from "./Enums";
import { Summarize } from "./OnboardingSummarize";
import { LoadPrograms, useAppDispatch, useAppSelector } from "./LoadPrograms";
import { fetchSubjectsForProgram, resetSubjects } from "../../redux/slices/subject";
import { mapSubjectsToOptions } from "./utils/mapSubjectsToOptions";

import { SavingOverlay } from './SavingOverlay';

import type { UserPreference } from "../../interfaces/user/preferences";
import styles from "./Onboarding.module.css";
import { useSelectionHandler } from "./hooks/useSelectionHandler";


export function Onboarding({ 
  title = "Komma igång med Stegvis", 
  buttonText = "Fortsätt", 
  hint = "Du kan alltid ändra dina preferenser i inställningar",
  hint2 = "Ställ in dina preferenser nedan för att få en anpassad upplevelse", redirectPath }: any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const enums = useAppSelector(state => state.enums);
  const userPrefs = useAppSelector(state => state.preferences);
  const programsState = useAppSelector(state => state.programs);
  const subjectsState = useAppSelector(state => state.subjects);
  const programs = programsState.data;
  const programDetails = subjectsState.data;

  const [localPrefs, setLocalPrefs] = useState<UserPreference>({ ...userPrefs, educationLevel: userPrefs.educationLevel || "Gymnasiet" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const resp = await getUserPreferences();
        setLocalPrefs({ ...resp.userPreference, educationLevel: resp.userPreference.educationLevel || "Gymnasiet" });
        dispatch(setPreferences(resp.userPreference));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPreferences();
  }, [dispatch]);

  const updateField = (field: keyof UserPreference, value: any) => {
    setLocalPrefs(prev => ({ ...prev, [field]: value }));
    if (field === "fieldOfStudy" && typeof value === "string") {
      dispatch(resetSubjects());
      const selectedProgram = programs.find(p => `${p.name} (${p.code})` === value);
      if (selectedProgram) dispatch(fetchSubjectsForProgram(selectedProgram.code));
    }
  };

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      await setUserPreferences(localPrefs);
      dispatch(setPreferences(localPrefs));
      setSaved(true);
      setTimeout(() => { dispatch(setHasCompletedOnboarding(true)); setSaving(false); if (redirectPath) navigate(redirectPath); }, 2000);
    } catch (err) { console.error(err); setSaving(false); }
  };

  if (!enums) return <p>Laddar enums...</p>;

  const foundationSubjects = localPrefs.fieldOfStudy ? programDetails?.foundationSubjects?.subjects ?? [] : [];
  const programmeSubjects = localPrefs.fieldOfStudy ? programDetails?.programmeSpecificSubjects?.subjects ?? [] : [];
  const specializationSubjects = localPrefs.fieldOfStudy ? programDetails?.specialization?.subjects ?? [] : [];
  const specializationSubjectsFiltered = specializationSubjects.filter(s => !foundationSubjects.some(f => f.code === s.code) && !programmeSubjects.some(p => p.code === s.code));


  const handleSelect = useSelectionHandler(localPrefs.educationLevel, val => updateField("educationLevel", val), false);

  return (
    <div className={styles.onboardingWrapper}>
      <div className={styles.onboardingContainer}>
        <h3>{title}</h3>
        <p className={styles.hint2}>{hint2}</p>
        <LoadEnums />
        <LoadPrograms />

        <PreferenceSection
        title="Skolnivå"
        options={enums.educationLevels.map(e => ({ name: e, code: e }))}
        selected={localPrefs.educationLevel}
        onSelect={handleSelect}
        />

        <PreferenceSection
        title="År"
        options={enums.year.map(y => ({ name: y, code: y }))}
        selected={localPrefs.year}
        onSelect={val => updateField("year", val)} 
        />

        {!programsState.loading && !programsState.error && programs.length > 0 &&
        <PreferenceSection 
        title="Program"
        options={programs.map(p => ({ name: `${p.name} (${p.code})`, code: `${p.name} (${p.code})` }))}
        selected={localPrefs.fieldOfStudy}
        onSelect={val => updateField("fieldOfStudy", val)} searchable 
        />}

        {foundationSubjects.length > 0 &&
        <PreferenceSection title="Grundämnen"
        options={mapSubjectsToOptions(foundationSubjects)}
        selected={localPrefs.subjects}
        onSelect={val => updateField("subjects", val)} multiple
        />}

        {programmeSubjects.length > 0 &&
        <PreferenceSection
        title="Programgemensamma ämnen"
        options={mapSubjectsToOptions(programmeSubjects)}
        selected={localPrefs.subjects}
        onSelect={val => updateField("subjects", val)} multiple
        />}

        {specializationSubjectsFiltered.length > 0 &&
        <PreferenceSection title="Fördjupningar"
        options={mapSubjectsToOptions(specializationSubjectsFiltered)}
        selected={localPrefs.subjects}
        onSelect={val => updateField("subjects", val)} multiple
        />}

        <PreferenceSection
        title="Fokusdagar"
        options={enums.focusDays.map(d => ({ name: d, code: d }))}
        selected={localPrefs.focusDays}
        onSelect={val => updateField("focusDays", val)} multiple
        />
          
        <PreferenceSection
        title="Dagligt mål"
        options={enums.dailyGoals.map(g => ({ name: `${g} min`, code: `${g}` }))}
        selected={localPrefs.dailyGoal ? `${localPrefs.dailyGoal} min` : null}
        onSelect={val => updateField(
          "dailyGoal",
          typeof val === "string" ? Number(val.split(" ")[0]) : Number(val[0].split(" ")[0])
        )}
      />

        <PreferenceSection
        title="Vad vill du ha hjälp med?"
        options={enums.helpRequests.map(h => ({ name: h, code: h }))}
        selected={localPrefs.helpRequests}
        onSelect={val => updateField("helpRequests", val)} multiple
        />

        <div className={styles.savePrefWrapper}>
          <button className={styles.savePrefBtn} onClick={handleSave} disabled={saving}>{buttonText}</button>
          <p>{hint}</p>
        </div>
      </div>

      <div className={styles.summarizeContainer}>
        <Summarize userPrefs={localPrefs} />
      </div>
      <SavingOverlay saving={saving} saved={saved} />
    </div>
  );
}