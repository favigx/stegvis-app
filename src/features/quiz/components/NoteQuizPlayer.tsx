import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadQuizById } from "../hooks/useLoadQuizById";
import styles from "./NoteQuizPlayer.module.css";
import { motion } from "framer-motion";
import { Progress } from "./Progress"; 
import { Button } from "./Button";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

type NoteQuizPlayerProps = {
  quizId: string;
};

export default function NoteQuizPlayer({ quizId }: NoteQuizPlayerProps) {
  const navigate = useNavigate();
  const { data: quiz, isLoading, error } = useLoadQuizById(quizId);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | null>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  if (isLoading) return <p className={styles.loading}>Laddar quiz...</p>;
  if (error) return <p className={styles.error}>Fel: {error.message}</p>;
  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const calculatedScore = quiz.questions.reduce((sum, q, i) => {
        const selectedIdx = selectedAnswers[i];
        if (selectedIdx === undefined || selectedIdx === null) return sum;
        return q.options[selectedIdx]?.correct ? sum + 1 : sum;
      }, 0);
      setScore(calculatedScore);
      setIsFinished(true);
    }
  };

  const handleCancel = () => {
    navigate("/quiz");
  };

  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.container}
      >
        <Card className={styles.card}>
          <CardTitle className={styles.quizTitle}>{quiz.quizName}</CardTitle>
          <p className={styles.resultText}>
            Du fick <strong>{score}</strong> av {quiz.questions.length} rätt 🎉
          </p>
          <Progress value={(score / quiz.questions.length) * 100} className={styles.progress} />
          <div className={styles.buttonGroup}>
            <Button onClick={() => navigate("/quiz")}>Tillbaka till quiz</Button>
            <Button onClick={() => window.location.reload()} className={styles.retryButton}>
              Gör om quizet
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.container}
    >
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.quizTitle}>{quiz.quizName}</CardTitle>
          <p className={styles.questionCount}>
            Fråga {currentQuestion + 1} av {quiz.questions.length}
          </p>
        </CardHeader>

        <CardContent>
          <p className={styles.questionText}>{question.question}</p>

          <div className={styles.optionsContainer}>
            {question.options.map((option, index) => {
              const selected = selectedAnswers[currentQuestion] === index;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelectOption(index)}
                  className={`${styles.optionButton} ${
                    selected ? styles.optionSelected : ""
                  }`}
                >
                  {option.optionText}
                </motion.button>
              );
            })}
          </div>

          <div className={styles.footer}>
            <Progress
              value={((currentQuestion + 1) / quiz.questions.length) * 100}
              className={styles.progress}
            />
            <div className={styles.buttonGroup}>
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] == null}
                className={styles.nextButton}
              >
                {currentQuestion < quiz.questions.length - 1 ? "Nästa" : "Visa resultat"}
              </Button>
              <Button onClick={handleCancel} className={styles.cancelButton}>
                Avbryt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
