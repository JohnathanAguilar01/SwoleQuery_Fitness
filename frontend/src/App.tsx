import { useUser } from "./context/UserContext";
import MainPage from "./components/MainPage/MainPage";
import DashBoard from "./components/MainPage/Dashboard";
import Login from "./components/Login/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup/Signup";

function App() {
  const { user } = useUser();
  
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
  
      {/* Catch‑all: if the user is logged in show the dashboard,
          otherwise send them to /login */}
      <Route
        path="/*"
        element={
          user ? (
            <MainPage>
              <DashBoard />
            </MainPage>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;