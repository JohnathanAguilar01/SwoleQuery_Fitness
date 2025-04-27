// Define the type for the incoming component
import { FaRunning } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { useUser } from "@/context/UserContext";
import { MdSpaceDashboard, MdOutlineMenuBook } from "react-icons/md";

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

type MainPageProps = {
  children: React.ReactNode;
  setActiveTab: (tab: "dashboard" | "diary" | "progress") => void;
  activeTab: "dashboard" | "diary" | "progress";
};

function MainPage({ children, setActiveTab, activeTab }: MainPageProps) {
  const { user } = useUser();

  return (
    <div className="flex justify-start w-screen h-screen bg-zinc-300">
      {/* SideBar */}
      <div className="w-72 h-screen bg-white shadow-lg flex flex-col items-center">
        {/* App name */}
        <div className="flex justify-center mt-2 mb-8">
          <FaRunning size={30} />
          <h1 className="inline font-bold text-2xl">Swole</h1>
          <h1 className="inline font-bold text-2xl text-blue-500">Query</h1>
        </div>
        {/* Sidebar tabs */}
        <div
          className="relative flex items-center w-full h-12 mb-2"
          onClick={() => setActiveTab("dashboard")}
        >
          {activeTab === "dashboard" && (
            <div className="absolute h-full z-1 bg-blue-100 border-r-blue-800 border-r-[6px] left-6 right-0 rounded-l-3xl" />
          )}
          <div className="absolute flex left-14 z-10">
            <MdSpaceDashboard size={30} className="z-10" />
            <h2 className="font-semibold text-xl ml-1 z-10">DashBoard</h2>
          </div>
        </div>

        <div
          className="relative flex items-center w-full h-12 bg-red-5 mb-2"
          onClick={() => setActiveTab("diary")}
        >
          {activeTab === "diary" && (
            <div className="absolute h-full z-1 bg-blue-100 border-r-blue-800 border-r-[6px] left-6 right-0 rounded-l-3xl" />
          )}
          <div className="absolute flex left-14 z-10">
            <MdOutlineMenuBook size={30} />
            <h2 className="font-semibold text-xl ml-1">Diary</h2>
          </div>
        </div>

        <div
          className="relative flex items-center w-full h-12 mb-2"
          onClick={() => setActiveTab("progress")}
        >
          {activeTab === "progress" && (
            <div className="absolute h-full z-1 bg-blue-100 border-r-blue-800 border-r-[6px] left-6 right-0 rounded-l-3xl" />
          )}
          <div className="absolute flex left-14 z-10">
            <GiProgression size={30} className="z-10" />
            <h2 className="font-semibold text-xl ml-1 z-10">Progress</h2>
          </div>
        </div>
      </div>

      {/* Topbar and wraped children */}
      <div className="flex flex-col items-center w-full p-4">
        <div className="w-full h-14 bg-zinc-100 rounded-lg flex justify-end items-center mb-6">
          <h1 className="font-bold text-2xl w-fit mx-auto">
            {user?.first_name}
            {"'s "}
            {capitalizeFirstLetter(activeTab)}
          </h1>
          {/*
          <FaRegUserCircle size={40} className="mx-4" />
          */}
        </div>
        {children}
      </div>
    </div>
  );
}

export default MainPage;
