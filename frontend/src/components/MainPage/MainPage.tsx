// Define the type for the incoming component
import { FaRunning } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { MdSpaceDashboard, MdOutlineMenuBook } from "react-icons/md";

type MainPageProps = {
  children: React.ReactNode;
  setActiveTab: (tab: "dashboard" | "diary") => void;
  activeTab: "dashboard" | "diary";
};

function MainPage({ children, setActiveTab, activeTab }: MainPageProps) {
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
      </div>

      {/* Topbar and wraped children */}
      <div className="flex flex-col items-center w-full p-4">
        <div className="w-full h-14 bg-zinc-100 rounded-lg flex justify-end items-center mb-6">
          <FaRegUserCircle size={40} className="mx-4" />
        </div>
        {children}
      </div>
    </div>
  );
}

export default MainPage;
