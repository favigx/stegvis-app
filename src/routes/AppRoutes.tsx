import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import PublicRoute from "./PublicRoutes";

import Login from "../features/auth/components/Login";
import Register from "../features/auth/components/Register";
import LandingPage from "../features/landing/components/Landing";
import { Onboarding } from "../features/onboarding/components/Onboarding";
import { Deadline } from "../features/deadline/components/Deadline";
import EditPreferences from "../features/user-settings/components/EditPreferences";
import Notes from "../features/notes/components/Notes";
import Subscription from "../features/subscription/components/Subscription";
import GoalPlanner from "../features/goalplanner/components/GoalPlanner";
import UserSettings from "../features/user-settings/components/UserSettings";
import StudyPlanner from "../features/studyplanner/components/StudyPlanner";
import OAuth2Success from "../features/auth/components/Oauth2Success";

// Quiz components
import Quiz from "../features/quiz/components/Quiz";
import NoteQuizPlayer from "../features/quiz/components/NoteQuizPlayer";

const Home = () => <div>Home Page</div>;

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/logga-in" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/registrera-dig" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/oauth2/success" element={<PublicRoute><OAuth2Success /></PublicRoute>} />

      {/* Private routes */}
      <Route path="/hem" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/kom-igang" element={<PrivateRoute><Onboarding redirectPath="/hem" /></PrivateRoute>} />
      <Route path="/studieplaneraren/*" element={<PrivateRoute><StudyPlanner /></PrivateRoute>} />

      {/* Quiz routes */}
      <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
      <Route path="/quiz/:quizId" element={<PrivateRoute><NoteQuizPlayerWrapper /></PrivateRoute>} />

      <Route path="/deadlines" element={<PrivateRoute><Deadline /></PrivateRoute>} />
      <Route path="/min-utbildning" element={<PrivateRoute><EditPreferences /></PrivateRoute>} />
      <Route path="/anteckningar" element={<PrivateRoute><Notes /></PrivateRoute>} />
      <Route path="/abonnemang" element={<PrivateRoute><Subscription /></PrivateRoute>} />
      <Route path="/malplaneraren" element={<PrivateRoute><GoalPlanner /></PrivateRoute>} />
      <Route path="/installningar" element={<PrivateRoute><UserSettings /></PrivateRoute>} />
    </Routes>
  );
}

// Wrapper för NoteQuizPlayer som hämtar quizId från URL
import { useParams } from "react-router-dom";

function NoteQuizPlayerWrapper() {
  const { quizId } = useParams<{ quizId: string }>();
  if (!quizId) return <p>Quiz saknas</p>;
  return <NoteQuizPlayer quizId={quizId} />;
}
