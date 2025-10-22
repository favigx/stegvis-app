import React, { useState } from "react";
import { UniversityCard } from "./UniversityCard";
import { useLoadEligiblePrograms } from "../hooks/useGetEligiblePrograms";
import styles from "./UniversityPrograms.module.css";

export function UniversityPrograms() {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const { data: programs, isLoading, error } = useLoadEligiblePrograms(searchTerm);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm(inputValue.trim() || null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.introText}>
        <p>
          Här kan du söka och se resultat på universitetsutbildningar du nuvarande har tillräckligt meritvärde för.
          Sök på ett nyckelord, till exempel "juridik", så får du upp juristlinjer i hela Sverige.
        </p>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Sök program, t.ex. juridik eller ekonomi"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Sök
        </button>
      </form>

      {isLoading && <div className={styles.loading}>Laddar program...</div>}
      {error && <div className={styles.error}>Fel: {error.message}</div>}
      {programs && programs.length === 0 && <div className={styles.empty}>Inga program hittades</div>}

      <div className={styles.programsGrid}>
        {programs?.map((program) => (
          <UniversityCard key={program.programnamn} program={program} />
        ))}
      </div>
    </div>
  );
}

export default UniversityPrograms;
