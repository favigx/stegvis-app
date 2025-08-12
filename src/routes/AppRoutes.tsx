import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoutes";
import Login from "../components/login/Login";
import LandingPage from "../components/landing/Landing";
import Register from "../components/register/Register";

const Home = () => <div>Home Page</div>;

export default function AppRoutes() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}