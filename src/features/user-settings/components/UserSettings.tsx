import { useState } from "react";
import UserSettingsSidebar from "./UserSettIngsSidebar";
import styles from './UserSettings.module.css';
import ChangeProfileForm from "./ChangeProfileForm";

function UserSettings() {
  const [selectedCategory, setSelectedCategory] = useState<string>("profil");

  return (
    <div className={styles.wrapper}>
      <UserSettingsSidebar onSelectCategory={setSelectedCategory} />

      <div className={styles.content}>
     

        {selectedCategory === "profil" && (
          <div>
          
           <ChangeProfileForm />
          </div>
        )}

        {selectedCategory === "säkerhet" && (
          <div>
            <h2>Säkerhet</h2>
            <p>Här kan du ändra säkerhetsinställningar som lösenord och 2FA.</p>
          </div>
        )}

        {selectedCategory === "integritet" && (
          <div>
            <h2>Integritet</h2>
            <p>Hantera din kontoinformation, synlighet och datadelning.</p>
            <ul>
              <li>Kontots synlighet (offentlig / privat)</li>
              <li>Vem kan se din profilinformation</li>
              <li>Dela data med tredjepartstjänster</li>
              <li>Exportera eller ta bort ditt konto</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserSettings;
