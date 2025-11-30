import { useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import { useGetTodos } from "../hooks/useGetTodos";
import { useMarkTodoOngoing } from "../hooks/userMarkTodoOngoing";
import { useMarkTodoCompleted } from "../hooks/useMarkTodoCompleted";
import { useAddTodo } from "../hooks/useAddTodo";
import { Plus, X } from "lucide-react";
import { getUniqueSubjectColor } from "../../notes/utils/getSubjectColor";
import { useDeleteTodo } from "../hooks/useDeleteTodo";
import { useQueryClient } from "@tanstack/react-query";
import styles from "./TodoBoard.module.css";

export function TodoBoard() {
  const { data: todos = [], isLoading, isError } = useGetTodos();
  const markOngoing = useMarkTodoOngoing();
  const markCompleted = useMarkTodoCompleted();
  const addTodo = useAddTodo();
  const deleteTodo = useDeleteTodo();
  const queryClient = useQueryClient();

  const userSubjects = useSelector((state: RootState) => state.preferences.subjects || []);

  const [showInput, setShowInput] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (isLoading) return <p>Laddar todos...</p>;
  if (isError) return <p>Något gick fel vid hämtning av todos.</p>;

  const todoTasks = todos.filter((t) => t.status === "TODO");
  const ongoingTasks = todos.filter((t) => t.status === "ONGOING");
  const completedTasks = todos.filter((t) => t.status === "COMPLETED");

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    if (destination.droppableId === "ongoing") markOngoing.mutate(draggableId, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
    else if (destination.droppableId === "completed") markCompleted.mutate(draggableId, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
    });
  };

  const handleAddTodo = () => {
    if (!newDescription.trim()) return;

    addTodo.mutate(
      { description: newDescription, subject: selectedSubject },
      {
        onSuccess: () => {
          setNewDescription("");
          setSelectedSubject("");
          setShowInput(false);
          setDropdownOpen(false);
          queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
      }
    );
  };

  const handleDeleteTodo = (id: string) => {
    if (!confirm("Är du säker på att du vill ta bort detta todo?")) return;

    deleteTodo.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todos"] });
      },
    });
  };

  const renderTasks = (tasks: typeof todos, colorClass: string) => (
    <div className={styles.todosContainer}>
      {tasks.map((todo, index) => {
        const subjectName = todo.subject || "Övrigt";
        const circleColor = getUniqueSubjectColor(subjectName);

        return (
          <Draggable key={todo.id} draggableId={todo.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className={`${styles.todoCard} ${colorClass}`}
                style={{ position: "relative", ...provided.draggableProps.style }}
              >
                {/* X-knapp */}
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
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

                <div style={{ display: "flex", alignItems: "center", marginBottom: "-10px" }}>
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: circleColor,
                      marginRight: "8px",
                    }}
                  />
                  <span style={{ fontWeight: 600, fontSize: "14px" }}>{subjectName}</span>
                </div>

                <p className={styles.todoDescription}>{todo.description}</p>
                <p className={styles.todoDate}>
                  Skapad: {new Date(todo.dateTimeCreated).toLocaleDateString()}
                </p>
              </div>
            )}
          </Draggable>
        );
      })}
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.boardContainer}>
        {/* TODO */}
        <Droppable droppableId="todo">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.column}
              style={{ minHeight: "50px", paddingBottom: "8px" }}
            >
              <div className={styles.columnHeaderWrapper}>
                <h2 className={styles.columnHeader}>
                  <span className={`${styles.statusCircle} ${styles.red}`}></span>
                  Uppgifter
                </h2>
                <button
                  className={styles.addButton}
                  onClick={() => setShowInput((prev) => !prev)}
                >
                  <Plus size={16} color="white" />
                </button>
              </div>

              {showInput && (
                <div className={styles.newTodoContainer}>
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
                          <span
                            className={styles.dropdownCircle}
                            style={{
                              backgroundColor: getUniqueSubjectColor(selectedSubject),
                            }}
                          />
                          <span style={{ marginLeft: "8px" }}>{selectedSubject}</span>
                        </>
                      ) : (
                        "Välj kurs"
                      )}
                    </div>

                    {dropdownOpen && (
                      <ul className={styles.dropdownList}>
                        {userSubjects.map((subj) => {
                          const color = getUniqueSubjectColor(subj.courseName);
                          return (
                            <li
                              key={subj.subjectCode}
                              className={styles.dropdownItem}
                              onClick={() => {
                                setSelectedSubject(subj.courseName);
                                setDropdownOpen(false);
                              }}
                            >
                              <span
                                className={styles.dropdownCircle}
                                style={{ backgroundColor: color }}
                              />
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

                  <div className={styles.newTodoButtons}>
                    <button className={styles.addTodoButton} onClick={handleAddTodo}>
                      Lägg till
                    </button>
                    <button
                      className={styles.cancelTodoButton}
                      onClick={() => setShowInput(false)}
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              )}

              {renderTasks(todoTasks, styles.todoRed)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* ONGOING */}
        <Droppable droppableId="ongoing">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.column}
              style={{ minHeight: "50px", paddingBottom: "8px" }}
            >
              <div className={styles.columnHeaderWrapper}>
                <h2 className={styles.columnHeader}>
                  <span className={`${styles.statusCircle} ${styles.yellow}`}></span>
                  Pågående
                </h2>
              </div>
              {renderTasks(ongoingTasks, styles.todoYellow)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* COMPLETED */}
        <Droppable droppableId="completed">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={styles.column}
              style={{ minHeight: "50px", paddingBottom: "8px" }}
            >
              <div className={styles.columnHeaderWrapper}>
                <h2 className={styles.columnHeader}>
                  <span className={`${styles.statusCircle} ${styles.green}`}></span>
                  Klart
                </h2>
              </div>
              {renderTasks(completedTasks, styles.todoGreen)}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}