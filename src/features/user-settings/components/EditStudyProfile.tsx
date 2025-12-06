import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useLoadPrograms } from "../../onboarding/hooks/useLoadPrograms"; 
import { useLoadEnums } from "../../onboarding/hooks/useLoadEnums";
import { useLoadUserPreferences } from "../../onboarding/hooks/useLoadUserPreferences";
import { useSetUserPreference } from "../../onboarding/hooks/useSetUserPreference";

import { OnboardingPreferences } from "../../onboarding/components/OnboardingPreferences";
import { useSelectionHandler } from "../../onboarding/hooks/useSelectionHandler";

import { setPreferences } from "../../../redux/slices/userPreferenceSlice";

import type { UserPreference } from "../../onboarding/types/userPreferences/userPreferences";
import type { AddOnboardingPreferencesDTO } from "../../onboarding/types/userPreferences/addOnboardingPreferencesDTO";
import type { RootState } from "../../../redux/store";

import styles from "./EditStudyProfile.module.css"; 

interface EditStudyProfileProps {
  initialPrefs?: UserPreference;
  onPrefsChange?: (updatedPrefs: UserPreference) => void;
  onComplete?: () => void;
}

export function EditStudyProfile({ initialPrefs, onPrefsChange, onComplete }: EditStudyProfileProps) {
  const dispatch = useDispatch();

  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const { data: programs, isLoading: programsLoading, error: programsError } = useLoadPrograms();
  const { data: enums, isLoading: enumsLoading, error: enumsError } = useLoadEnums();
  const { data: userPrefData, isLoading: userPrefLoading, error: userPrefError } =
    useLoadUserPreferences();

  const { mutate: savePreferences } = useSetUserPreference();

  const [localPrefs, setLocalPrefs] = useState<UserPreference>({
    educationLevel:
      initialPrefs?.educationLevel ||
      persistedPrefs.educationLevel ||
      userPrefData?.userPreference?.educationLevel ||
      "Gymnasiet",
    program:
      initialPrefs?.program ||
      persistedPrefs.program ||
      userPrefData?.userPreference?.program ||
      null,
    orientation:
      initialPrefs?.orientation ||
      persistedPrefs.orientation ||
      userPrefData?.userPreference?.orientation ||
      null,
    year:
      initialPrefs?.year ||
      persistedPrefs.year ||
      userPrefData?.userPreference?.year ||
      null,
  });

  useEffect(() => {
    if (userPrefData?.userPreference) {
      setLocalPrefs(prev => ({
        educationLevel: prev.educationLevel || userPrefData.userPreference.educationLevel,
        program: prev.program || userPrefData.userPreference.program,
        orientation: prev.orientation || userPrefData.userPreference.orientation,
        year: prev.year || userPrefData.userPreference.year,
      }));
    }
  }, [userPrefData]);

  const updateField = (field: keyof UserPreference, value: any) => {
    setLocalPrefs(prev => {
      const newPrefs = {
        ...prev,
        [field]: value,
        ...(field === "program" ? { orientation: null } : {}),
      };
      onPrefsChange?.(newPrefs);
      return newPrefs;
    });
  };

  const orientations = useMemo(() => {
    if (!localPrefs.program) return [];
    const programObj = programs?.find(
      p => `${p.name} (${p.code})` === `${localPrefs.program?.name} (${localPrefs.program?.code})`
    );
    return (
      programObj?.orientations.map(o => ({
        name: o.name,
        code: o.code,
        points: Number(o.points),
      })) ?? []
    );
  }, [programs, localPrefs.program]);

  const handleSelect = useSelectionHandler(
    localPrefs.educationLevel,
    (val: string | string[]) => updateField("educationLevel", Array.isArray(val) ? val[0] : val),
    false
  );

  const handleSave = () => {
    const payload: AddOnboardingPreferencesDTO = {
      educationLevel: localPrefs.educationLevel,
      program: localPrefs.program
        ? { code: localPrefs.program.code, name: localPrefs.program.name }
        : null,
      orientation: localPrefs.orientation
        ? {
            code: localPrefs.orientation.code,
            name: localPrefs.orientation.name,
            points: localPrefs.orientation.points,
          }
        : null,
      year: localPrefs.year,
    };

    savePreferences(payload, {
      onSuccess: () => {
        dispatch(setPreferences(payload));
        onComplete?.();
      },
    });
  };

  const handleReset = () => {
    const resetPrefs: UserPreference = {
      educationLevel: "Gymnasiet",
      program: null,
      orientation: null,
      year: null,
    };
    setLocalPrefs(resetPrefs);
    onPrefsChange?.(resetPrefs);
  };

  if (programsLoading || enumsLoading || userPrefLoading) return <p>Laddar...</p>;
  if (programsError || enumsError || userPrefError)
    return <p>Ett fel inträffade: {String(programsError || enumsError || userPrefError)}</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.onboardingContainer}>

          {/* BARA formuläret – ingen stegtext */}
          {enums && (
            <OnboardingPreferences
              localPrefs={localPrefs}
              enums={enums}
              programs={programs ?? []}
              orientations={orientations}
              updateField={updateField}
              handleSelect={handleSelect}
            />
          )}

          {/* Knappar */}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
            <button className={styles.resetAction} onClick={handleReset}>
              Rensa
            </button>
            <button className={styles.continueAction} onClick={handleSave}>
              Spara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
