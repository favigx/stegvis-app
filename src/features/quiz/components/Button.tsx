import React from "react";
import styles from "./button.module.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${
        variant === "secondary" ? styles.secondary : styles.primary
      } ${className}`}
      {...props}
    />
  );
}
