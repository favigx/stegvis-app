import { useState, useEffect } from "react";
import type { SubjectResponse } from "../../api/onboarding/skolverket/dto/subjectResponse";
import { getSkolverketSubjectsForProgram } from "../../api/onboarding/skolverket/details";

export function useSubjects(programCode: string | null) {
  const [subjects, setSubjects] = useState<SubjectResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!programCode) return;

    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const data: SubjectResponse = await getSkolverketSubjectsForProgram(programCode);
        setSubjects(data);
      } catch (err: any) {
        console.error("Failed to load subjects:", err.message || err);
        setError(err.message || "Kunde inte hämta ämnen");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [programCode]);

  return { subjects, loading, error };
}