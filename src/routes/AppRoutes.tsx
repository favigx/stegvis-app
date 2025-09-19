import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import Login from "../features/auth/components/Login";
import LandingPage from "../features/landing/components/Landing";
import Register from "../features/auth/components/Register";
import { Onboarding } from "../features/onboarding/components/Onboarding";
import { Deadline } from "../features/deadline/components/Deadline";
import EditPreferences from "../features/user-settings/components/EditPreferences";
import PublicRoute from "./PublicRoutes";
import Notes from "../features/notes/components/Notes";
import Subscription from "../features/subscription/components/Subscription";

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
    <Route path="/notes" element={<PrivateRoute><Notes /></PrivateRoute>} />
     <Route path="/subscription" element={<PrivateRoute><Subscription /></PrivateRoute>} />

</Routes>

  );
}