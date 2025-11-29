import { useState } from "react";
import styles from "./AnimatedSaveButton.module.css";

interface AnimatedSaveButtonProps {
  onSave: () => Promise<boolean> | boolean;
}

export function AnimatedSaveButton({ onSave }: AnimatedSaveButtonProps) {
  const [state, setState] = useState<"idle" | "pending" | "success" | "fail">("idle");

  const handleClick = async () => {
    try {
      setState("pending");
      const result = await onSave();
      setState(result ? "success" : "fail");
    } catch {
      setState("fail");
    }

    setTimeout(() => setState("idle"), 2000);
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.button} ${
          state === "pending"
            ? styles.pending
            : state === "success"
            ? styles.success
            : state === "fail"
            ? styles.fail
            : ""
        }`}
        onClick={handleClick}
        disabled={state !== "idle"}
      >
        <span className={styles.text}>Spara</span>
      </button>
    </div>
  );
}
