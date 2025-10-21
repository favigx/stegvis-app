import type { TermData } from "./TermData";

export interface EligibleProgramResponse {
    universitet: string;
    ort: string;
    programnamn: string;
    terminer: TermData[];
    antagningUrl: string;
}