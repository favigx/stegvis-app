import React from "react";
import { X, Upload } from "lucide-react";
import { useUploadFile } from "../hooks/useUploadFile";
import { useGetFilesForTodo } from "../hooks/useGetFilesForTodo";
import { useDeleteTodoFile } from "../hooks/useDeleteTodoFile";
import { getUniqueSubjectColor } from "../../notes/utils/getSubjectColor";
import { useQueries } from "@tanstack/react-query";
import { getFileUrl } from "../api/todoAPI";
import styles from "./TodoBoard.module.css";

interface Todo {
  id: string;
  description: string;
  subject?: string;
  links?: string; // <-- Lagt till
  status: "TODO" | "ONGOING" | "COMPLETED";
  dateTimeCreated: string;
  dateTimeCompleted?: string;
  durationDays?: number;
}

interface TodoCardProps {
  todo: Todo;
  colorClass: string;
  onDelete: (id: string) => void;
}

export function TodoCard({ todo, colorClass, onDelete }: TodoCardProps) {
  const uploadMutation = useUploadFile(todo.id);
  const { data: files = [], isLoading: filesLoading } = useGetFilesForTodo(todo.id);
  const deleteFileMutation = useDeleteTodoFile(todo.id);

  const fileQueries = useQueries({
    queries: files.map((file) => ({
      queryKey: ["fileUrl", file.id],
      queryFn: () => getFileUrl(file.id),
      enabled: !!file.id,
    })),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadMutation.mutate(file);
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm("Är du säker på att du vill ta bort denna fil?")) {
      deleteFileMutation.mutate(fileId);
    }
  };

  const subjectName = todo.subject || "Övrigt";
  const circleColor = getUniqueSubjectColor(subjectName);

  return (
    <div className={`${styles.todoCard} ${colorClass}`} style={{ position: "relative" }}>
      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          backgroundColor: "#ef4444",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <X size={16} color="white" />
      </button>

      {/* All content wrapper for left alignment */}
      <div className={styles.todoCardContent}>
        {/* Subject */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "-10px" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: circleColor, marginRight: "8px" }} />
          <span style={{ fontWeight: 600, fontSize: "14px" }}>{subjectName}</span>
        </div>

        {/* Description */}
        <p className={styles.todoDescription}>{todo.description}</p>

        {/* Links */}
        {todo.links && (
          <div style={{ marginTop: "6px" }}>
            {(Array.isArray(todo.links) ? todo.links : todo.links.split?.(",") || []).map((link) => (
              <div key={link}>
                <a
                  href={link.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.todoLink}
                >
                  {link.trim()}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Files list */}
        <div style={{ marginTop: "8px" }}>
          {filesLoading ? (
            <p>Laddar filer...</p>
          ) : files.length === 0 ? (
            <p style={{ fontStyle: "italic", color: "#6b7280" }}>Inga filer uppladdade</p>
          ) : (
            <ul className={styles.todoFileList}>
              {files.map((file, index) => {
                const query = fileQueries[index];
                let content: React.ReactNode;

                if (!query || query.isLoading) content = "Laddar...";
                else if (query.isError || !query.data) content = "Kunde inte ladda fil";
                else content = (
                  <a
                    href={query.data}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.todoFileLink}
                  >
                    {file.fileName}
                  </a>
                );

                return (
                  <li key={file.id} className={styles.todoFileItem}>
                    {content}
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      style={{ background: "transparent", border: "none", cursor: "pointer" }}
                      title="Ta bort fil"
                    >
                      <X size={16} color="#ef4444" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* File upload */}
        {(todo.status === "TODO" || todo.status === "ONGOING") && (
          <div style={{ marginTop: "8px" }}>
            <label
              htmlFor={`file-upload-${todo.id}`}
              style={{ display: "flex", alignItems: "center", cursor: "pointer", gap: "4px", fontSize: "14px", color: "#2563eb" }}
            >
              <Upload size={16} />
              {uploadMutation.isPending ? "Laddar..." : "Ladda upp fil"}
            </label>
            <input
              id={`file-upload-${todo.id}`}
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {uploadMutation.isError && <p style={{ color: "red" }}>{uploadMutation.error?.message}</p>}
          </div>
        )}

        {/* Status info */}
        {todo.status === "ONGOING" && <p className={styles.todoDate}>Pågående: {todo.durationDays ?? 0} dagar</p>}
        {todo.status === "COMPLETED" && (
          <>
            <p className={styles.todoDate}>Skapad: {new Date(todo.dateTimeCreated).toLocaleDateString()}</p>
            <p className={styles.todoDate}>Färdig: {todo.dateTimeCompleted ? new Date(todo.dateTimeCompleted).toLocaleDateString() : "-"}</p>
          </>
        )}
        {todo.status === "TODO" && <p className={styles.todoDate}>Skapad: {new Date(todo.dateTimeCreated).toLocaleDateString()}</p>}
      </div>
    </div>
  );
}
