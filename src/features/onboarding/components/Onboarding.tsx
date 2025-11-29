import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowBigRight, Eraser } from "lucide-react";

import { useLoadPrograms } from "../hooks/useLoadPrograms";
import { useLoadEnums } from "../hooks/useLoadEnums";
import { useLoadUserPreferences } from "../hooks/useLoadUserPreferences";
import { useSetUserPreference } from "../hooks/useSetUserPreference";

import { OnboardingPreferences } from "./OnboardingPreferences";
import { useSelectionHandler } from "../hooks/useSelectionHandler";
import { setPreferences } from "../../../redux/slices/userPreferenceSlice";

import type { UserPreference } from "../types/userPreferences/userPreferences";
import type { AddOnboardingPreferencesDTO } from "../types/userPreferences/addOnboardingPreferencesDTO";
import type { RootState } from "../../../redux/store";

import styles from "./Onboarding.module.css";

interface OnboardingProps {
  hint?: string;
  initialPrefs?: UserPreference;
  onPrefsChange?: (updatedPrefs: UserPreference) => void;
  onComplete?: () => void; // 👈 NY
}

export function Onboarding({ hint, initialPrefs, onPrefsChange, onComplete }: OnboardingProps) {
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.profile.profile);
  const firstName = profile?.firstname ?? "";
  const persistedPrefs = useSelector((state: RootState) => state.preferences);

  const { data: programs, isLoading: programsLoading, error: programsError } = useLoadPrograms();
  const { data: enums, isLoading: enumsLoading, error: enumsError } = useLoadEnums();
  const { data: userPrefData, isLoading: userPrefLoading, error: userPrefError } = useLoadUserPreferences();
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

  const [, setStatus] = useState({ saving: false, saved: false });

  useEffect(() => {
    if (userPrefData?.userPreference) {
      setLocalPrefs(prev => ({
        educationLevel: prev.educationLevel || userPrefData.userPreference.educationLevel || "Gymnasiet",
        program: prev.program || userPrefData.userPreference.program || null,
        orientation: prev.orientation || userPrefData.userPreference.orientation || null,
        year: prev.year || userPrefData.userPreference.year || null,
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
    if (!programObj?.orientations) return [];
    return programObj.orientations.map(o => ({
      name: o.name,
      code: o.code,
      points: Number(o.points),
    }));
  }, [programs, localPrefs.program]);

  const handleSelect = useSelectionHandler(
    localPrefs.educationLevel,
    (val: string | string[]) => updateField("educationLevel", Array.isArray(val) ? val[0] : val),
    false
  );

  const isComplete = Boolean(
    localPrefs.educationLevel &&
      localPrefs.program &&
      localPrefs.year &&
      (orientations.length === 0 || !!localPrefs.orientation)
  );

  const handleSave = () => {
    setStatus({ saving: true, saved: false });

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

        setStatus({ saving: false, saved: true });

        setTimeout(() => {
          setStatus({ saving: false, saved: false });
          onComplete?.();
        }, );
      },
      onError: () => {
        setStatus({ saving: false, saved: false });
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

  if (userPrefLoading || programsLoading || enumsLoading) return <p>Laddar...</p>;
  if (userPrefError || programsError || enumsError)
    return <p>Ett fel inträffade: {String(userPrefError || programsError || enumsError)}</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.onboardingContainer}>
          
          <p className={styles.hint}>
             <strong>Del 1: Introduktion</strong>
             <br/><br/>Hej och välkommen {firstName}!</p>

          <p className={styles.hint}>
            {hint ?? (
              <>
                För att ge dig en så anpassad upplevelse som möjligt ber vi dig att följa
                stegen för att fylla i din studieprofil.
                <br />
                <br />
                Vi vet att det kan vara komplicerat med ett nytt digitalt verktyg men vi är
                här för att vägleda dig, steg för steg. Att komma igång tar bara några
                minuter och gör Stegvis skräddarsytt för dig. 
                <br />
                <br />
                Till vänster kan du se en sammanfattning av din studieprofil som uppdateras vid varje val du gör.
                <br />
                <br />
                Det första vi behöver veta om dig är vilket gymnasieprogram och årskurs du
                går i.
                <br />
                <br />
                Du kan hitta ditt program via sökrutan i programrutan – skriv programmets
                namn eller kod.
              </>
            )}
          </p>

          <div
            className={styles.hintExtra}
            style={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            <p
              style={{
                textDecoration: localPrefs.program ? "line-through" : "none",
                display: "flex",
                gap: "6px",
              }}
            >
              {localPrefs.program ? "✅ Steg 1 -" : "🎯 Steg 1 -"} Välj ditt gymnasieprogram
            </p>

            {localPrefs.program && orientations.length > 0 && (
              <p
                style={{
                  textDecoration: localPrefs.orientation ? "line-through" : "none",
                  display: "flex",
                  gap: "6px",
                }}
              >
                {localPrefs.orientation ? "✅ Steg 2 -" : "🎯 Steg 2 -"} Välj din
                programinriktning
              </p>
            )}

            {localPrefs.program &&
              ((localPrefs.orientation && orientations.length > 0) ||
                orientations.length === 0) && (
                <p
                  style={{
                    textDecoration: localPrefs.year ? "line-through" : "none",
                    display: "flex",
                    gap: "6px",
                  }}
                >
                  {localPrefs.year ? "✅ Steg 3 -" : "🎯 Steg 3 -"} Välj aktuell årskurs
                </p>
              )}

          {isComplete && (
  <div
    className={styles.continueAction}
    onClick={handleSave}
    style={{
      marginTop: "8px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    }}
  >
    {localPrefs.year === 1
      ? "Del 1/2 av komma igång är klar! Klicka här för att fortsätta"
      : "Del 1/4 av komma igång är klar! Klicka här för att fortsätta"}

    <ArrowBigRight size={25} />
  </div>
)}
          </div>

      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "20px", marginBottom: "15px" }}>
  <button type="button" className={styles.resetAction} onClick={handleReset}>
    <Eraser size={16} /> Rensa
  </button>
</div>
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
        </div>
      </div>

    
    </div>
  );
}
