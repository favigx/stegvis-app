import { useAllUserNoteQuizzes } from "../hooks/userGetAllUserNoteQuizzes"; 
import QuizCard from "./QuizCard";
import styles from "./AllQuizes.module.css";

function AllQuizes() {
  const { data: quizzes, isLoading, isError } = useAllUserNoteQuizzes();

  if (isLoading) return <div className={styles.statusText}>Laddar quiz...</div>;
  if (isError) return <div className={styles.statusError}>Kunde inte hämta quiz.</div>;
  if (!quizzes || quizzes.length === 0)
    return <div className={styles.statusText}>Inga quiz hittades.</div>;

  return (
    <div className={styles.quizGrid}>
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
}

export default AllQuizes;
