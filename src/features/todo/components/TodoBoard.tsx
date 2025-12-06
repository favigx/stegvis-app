// TodoBoard.tsx
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useGetTodos } from "../hooks/useGetTodos";
import { useMarkTodoOngoing } from "../hooks/userMarkTodoOngoing";
import { useMarkTodoCompleted } from "../hooks/useMarkTodoCompleted";
import { useMarkTodoNotStarted } from "../hooks/useMarkTodoNotStarted";
import { useAddTodo } from "../hooks/useAddTodo";
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import { Plus, Upload } from "lucide-react";
import { getUniqueSubjectColor } from "../../notes/utils/getSubjectColor";
import { useQueryClient } from "@tanstack/react-query";
import { TodoCard } from "./TodoCard";
import styles from "./TodoBoard.module.css";
import { uploadFile } from "../api/todoAPI";

export function TodoBoard() {
  const { data: todos = [], isLoading, isError } = useGetTodos();
  const markOngoing = useMarkTodoOngoing();
  const markCompleted = useMarkTodoCompleted();
  const markNotStarted = useMarkTodoNotStarted();
  const addTodo = useAddTodo();
  const deleteTodo = useDeleteTodo();
  const queryClient = useQueryClient();

  const userSubjects = useSelector((state: RootState) => state.preferences.subjects || []);

  const [showInput, setShowInput] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [links, setLinks] = useState<string[]>([""]);

  const addLinkInput = () => setLinks((prev) => [...prev, ""]);
  const updateLink = (index: number, value: string) =>
    setLinks((prev) => prev.map((l, i) => (i === index ? value : l)));

  if (isLoading) return <p>Laddar todos...</p>;
  if (isError) return <p>Något gick fel vid hämtning av todos.</p>;

  const todoTasks = todos.filter((t) => t.status === "TODO");
  const ongoingTasks = todos.filter((t) => t.status === "ONGOING");
  const completedTasks = todos.filter((t) => t.status === "COMPLETED");

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    if (destination.droppableId === "todo") {
      markNotStarted.mutate(draggableId, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }) });
    } else if (destination.droppableId === "ongoing") {
      markOngoing.mutate(draggableId, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }) });
    } else if (destination.droppableId === "completed") {
      markCompleted.mutate(draggableId, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }) });
    }
  };

  const handleAddTodo = () => {
    if (!newDescription.trim()) return;

    const nonEmptyLinks = links.filter((l) => l.trim() !== "");

    addTodo.mutate(
      { description: newDescription, subject: selectedSubject, links: nonEmptyLinks },
      {
        onSuccess: async (newTodo) => {
          setNewDescription("");
          setSelectedSubject("");
          setLinks([""]);
          setShowInput(false);
          setDropdownOpen(false);

          if (newFile) {
            try {
              await uploadFile(newTodo.id, newFile);
              setNewFile(null);
            } catch (err) {
              console.error("Fel vid filuppladdning:", err);
            }
          }

          queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
      }
    );
  };

  const handleDeleteTodo = (id: string) => {
    if (!confirm("Är du säker på att du vill ta bort detta todo?")) return;
    deleteTodo.mutate(id, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }) });
  };

  const renderTasks = (tasks: typeof todos, colorClass: string) => (
    <div className={styles.todosContainer}>
      {tasks.map((todo, index) => (
        <Draggable key={todo.id} draggableId={todo.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{ position: "relative", ...provided.draggableProps.style }}
            >
              <TodoCard todo={todo as any} colorClass={colorClass} onDelete={handleDeleteTodo} />
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );

  return (
    <div className={styles.todoBoardWrapper}>
      <h2 className={styles.mainTitle}>Drag och släpp, organisera uppgifter</h2>
      <p className={styles.mainP}>
        Skapa uppgift och dra sedan den till "Pågående" och när du är klar så drar du den till "Klart"
      </p>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.boardContainer}>
          {/* TODO Column */}
          <Droppable droppableId="todo">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={styles.column}>
                <div className={styles.columnHeaderWrapper}>
                  <h2 className={styles.columnHeader}>
                    <span className={`${styles.statusCircle} ${styles.red}`}></span> Uppgifter
                  </h2>
                  <button className={styles.addButton} onClick={() => setShowInput((prev) => !prev)}>
                    <Plus size={16} color="white" />
                  </button>
                </div>

                {showInput && (
                  <div className={styles.newTodoContainer}>
                    {/* Dropdown */}
                    <div className={styles.customDropdown}>
                      <div
                        className={styles.dropdownSelected}
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        style={{
                          borderColor: selectedSubject ? "#2563eb" : "#cbd5e1",
                          boxShadow: selectedSubject ? "0 0 0 2px rgba(37, 99, 235, 0.2)" : "none",
                        }}
                      >
                        {selectedSubject ? (
                          <>
                            <span className={styles.dropdownCircle} style={{ backgroundColor: getUniqueSubjectColor(selectedSubject) }} />
                            <span style={{ marginLeft: "8px" }}>{selectedSubject}</span>
                          </>
                        ) : "Välj kurs"}
                      </div>
                      {dropdownOpen && (
                        <ul className={styles.dropdownList}>
                          {userSubjects.map((subj) => {
                            const color = getUniqueSubjectColor(subj.courseName);
                            return (
                              <li
                                key={subj.subjectCode}
                                className={styles.dropdownItem}
                                onClick={() => { setSelectedSubject(subj.courseName); setDropdownOpen(false); }}
                              >
                                <span className={styles.dropdownCircle} style={{ backgroundColor: color }} />
                                {subj.courseName}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    {/* Beskrivning */}
                    <input
                      type="text"
                      placeholder="Beskrivning"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className={styles.newTodoInput}
                    />

                    {/* Länkar */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                      <label style={{ fontWeight: 600, fontSize: "14px" }}>Länkar</label>
                      {links.map((link, index) => (
                        <input
                          key={index}
                          type="text"
                          placeholder={`Länk ${index + 1}`}
                          value={link}
                          onChange={(e) => updateLink(index, e.target.value)}
                          className={styles.newTodoInput}
                        />
                      ))}
                      <button
                        onClick={addLinkInput}
                        style={{
                          marginTop: "4px",
                          padding: "4px 8px",
                          backgroundColor: "#e5e7eb",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "14px",
                          border: "1px solid #cbd5e1",
                        }}
                      >
                        + Lägg till länk
                      </button>
                    </div>

                    {/* Fil */}
                    <div style={{ marginTop: "8px" }}>
                      <label htmlFor="file-upload-new" style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", color: "#2563eb" }}>
                        <Upload size={16} /> {newFile ? newFile.name : "Ladda upp fil"}
                      </label>
                      <input
                        id="file-upload-new"
                        type="file"
                        onChange={(e) => { if (e.target.files) setNewFile(e.target.files[0]); }}
                        style={{ display: "none" }}
                      />
                    </div>

                    <div className={styles.newTodoButtons}>
                      <button className={styles.addTodoButton} onClick={handleAddTodo}>Lägg till</button>
                      <button className={styles.cancelTodoButton} onClick={() => setShowInput(false)}>Avbryt</button>
                    </div>
                  </div>
                )}

                {renderTasks(todoTasks, styles.todoRed)}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Ongoing Column */}
          <Droppable droppableId="ongoing">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={styles.column}>
                <div className={styles.columnHeaderWrapper}>
                  <h2 className={styles.columnHeader}>
                    <span className={`${styles.statusCircle} ${styles.yellow}`}></span> Pågående
                  </h2>
                </div>
                {renderTasks(ongoingTasks, styles.todoYellow)}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Completed Column */}
          <Droppable droppableId="completed">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={styles.column}>
                <div className={styles.columnHeaderWrapper}>
                  <h2 className={styles.columnHeader}>
                    <span className={`${styles.statusCircle} ${styles.green}`}></span> Klart
                  </h2>
                </div>
                {renderTasks(completedTasks, styles.todoGreen)}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
}
