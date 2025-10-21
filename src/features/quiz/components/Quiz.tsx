import { useState } from "react";
import QuizSidebar from "./QuizSidebar";
import styles from './Quiz.module.css';
import AllQuizes from "./AllQuizes";

function Quiz() {
  const [selectedCategory, setSelectedCategory] = useState<string>("item1");

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <div className={styles.sidebarWrapper}>
        <QuizSidebar onSelectCategory={setSelectedCategory} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        {selectedCategory === "all" && <AllQuizes />}
        {selectedCategory === "item2" && <h2>Content 2</h2>}
        {selectedCategory === "item3" && <h2>Content 3</h2>}
        {selectedCategory === "sub1" && <h2>Subcontent 1</h2>}
        {selectedCategory === "sub2" && <h2>Subcontent 2</h2>}
        {selectedCategory === "sub3" && <h2>Subcontent 3</h2>}
        {selectedCategory === "sub4" && <h2>Subcontent 4</h2>}
        {selectedCategory === "item4" && <h2>Content 4</h2>}
      </div>
    </div>
  );
}

export default Quiz;
