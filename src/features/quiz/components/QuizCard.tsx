import type { NoteQuizResponse } from "../types/noteQuizResponse";
import { Play } from "lucide-react";
import styles from "./QuizCard.module.css";
import { useNavigate } from "react-router-dom";

interface QuizCardProps {
  quiz: NoteQuizResponse;
}

function QuizCard({ quiz }: QuizCardProps) {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    navigate(`/quiz/${quiz.id}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <h2 className={styles.quizTitle}>{quiz.quizName}</h2>
        <p className={styles.courseName}>{quiz.courseName}</p>
        <p className={styles.questionCount}>{quiz.questions.length} frågor</p>
      </div>

      <button onClick={handleStartQuiz} className={styles.startButton}>
        <Play size={18} />
        <span>Starta quiz</span>
      </button>
    </div>
  );
}

export default QuizCard;
