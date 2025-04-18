import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import AuthRoutes from "./components/AuthRoutes/AuthRoutes"; // 👈 the new wrapper component

function App() {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Private/authenticated routes */}
      <Route path="/*" element={<AuthRoutes />} />
    </Routes>
  );
}

export default App;