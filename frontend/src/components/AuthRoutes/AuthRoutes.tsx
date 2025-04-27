import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";
import MainPage from "@/components/MainPage/MainPage";
import DashBoard from "@/components/MainPage/Dashboard/Dashboard";
import Diary from "../MainPage/Diary/Diary";
import Progress from "../MainPage/Progress/Progress";

const TABS = {
  dashboard: <DashBoard />,
  diary: <Diary />,
  progress: <Progress />,
};

export default function AuthRoutes() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<keyof typeof TABS>("dashboard");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainPage setActiveTab={setActiveTab} activeTab={activeTab}>
      {TABS[activeTab]}
    </MainPage>
  );
}
