import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import Login from "../components/login/Login";
import LandingPage from "../components/landing/Landing";
import Register from "../components/register/Register";
import { Onboarding } from "../components/onboarding/Onboarding";
import { DeadLine } from "../components/deadline/Deadline";

const Home = () => <div>Home Page</div>;


export default function AppRoutes() {
  return (
    
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/home" 
          element={<PrivateRoute><Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={<PrivateRoute><Onboarding />
            </PrivateRoute>
          } 
        />
         <Route 
          path="/deadline" 
          element={<PrivateRoute><DeadLine />
            </PrivateRoute>
          } 
        />
      </Routes>

  );
}