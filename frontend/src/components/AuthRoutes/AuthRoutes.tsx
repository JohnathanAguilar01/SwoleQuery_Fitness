import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";
import MainPage from "@/components/MainPage/MainPage";
import DashBoard from "@/components/MainPage/Dashboard";

export default function AuthRoutes() {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainPage>
      <DashBoard />
    </MainPage>
  );
}