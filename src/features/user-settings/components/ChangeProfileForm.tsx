import React, { useState, useEffect } from "react";
import { UserRoundPen, Save, X } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { fetchUserProfile } from "../../../redux/slices/profileSlice"; 
import { useAppDispatch } from "../../../redux/hooks"; // typad dispatch
import { useLoadPrograms } from "../../onboarding/hooks/useLoadPrograms"; // ✅ vår hook
import styles from "./ChangeProfileForm.module.css";

function ChangeProfileForm() {
  const dispatch = useAppDispatch();

  // Hämta profil från profileSlice
  const profile = useSelector((state: RootState) => state.profile.profile);

  const [firstName, setFirstName] = useState(profile?.firstname || "");
  const [lastName, setLastName] = useState(profile?.lastname || "");
  const [email, setEmail] = useState(profile?.email || "");

  // Hämta /me när komponenten mountar
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Uppdatera state när profile ändras
  useEffect(() => {
    setFirstName(profile?.firstname || "");
    setLastName(profile?.lastname || "");
    setEmail(profile?.email || "");
  }, [profile]);

  // ✅ Använd useLoadPrograms
  const { data: programs, isLoading, error } = useLoadPrograms();

  useEffect(() => {
    if (programs) {
      console.log("Program från Skolverket:", programs);
    }
  }, [programs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ firstName, lastName, email, programs });
    // här kan du anropa updateProfile API och dispatcha profileSlice action
  };

  const handleCancel = () => {
    setFirstName(profile?.firstname || "");
    setLastName(profile?.lastname || "");
    setEmail(profile?.email || "");
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.header}>
        <UserRoundPen size={25} className={styles.icon} />
        <h2>Redigera profil</h2>
      </div>

      {isLoading && <p>Laddar program...</p>}
      {error && <p>Ett fel inträffade: {String(error)}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Förnamn
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Förnamn"
          />
        </label>

        <label>
          Efternamn
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Efternamn"
          />
        </label>

        <label>
          E-postadress
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
          />
        </label>

        <div className={styles.buttonRow}>
          <button type="button" onClick={handleCancel} className={styles.cancelBtn}>
            <X size={16} /> Avbryt
          </button>

          <button type="submit" className={styles.submitBtn}>
            <Save size={16} /> Spara
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangeProfileForm;
