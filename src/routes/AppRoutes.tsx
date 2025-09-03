import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import Login from "../components/login/Login";
import LandingPage from "../components/landing/Landing";
import Register from "../components/register/Register";
import { Onboarding } from "../components/onboarding/Onboarding";
import { Deadline } from "../components/deadline/Deadline";
import EditPreferences from "../components/settings/preferences/EditPreferences";
import GoalPlanner from "../components/goalplanner/GoalPlanner";
import PublicRoute from "./PublicRoutes";

const Home = () => <div>Home Page</div>;


export default function AppRoutes() {
  return (
    
     <Routes>
  <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

  <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
  <Route path="/onboarding" element={<PrivateRoute><Onboarding redirectPath="/goalplanner" /></PrivateRoute>} />
  <Route path="/deadlines" element={<PrivateRoute><Deadline /></PrivateRoute>} />
  <Route path="/settings-preferences" element={<PrivateRoute><EditPreferences /></PrivateRoute>} />
  <Route path="/goalplanner" element={<PrivateRoute><GoalPlanner /></PrivateRoute>} />
</Routes>

  );
}