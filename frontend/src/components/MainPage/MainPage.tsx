// Define the type for the incoming component
import { FaRunning } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { MdSpaceDashboard } from "react-icons/md";

interface MainPage {
  component: React.ComponentType<any>; // or use generics for more strict props
}

const MainPage: React.FC<MainPage> = ({ component: Component }) => {
  return (
    <div className="flex justify-start w-screen h-screen bg-zinc-300">
      <div className="w-72 h-screen bg-white shadow-lg flex flex-col items-center">
        <div className="flex justify-center mt-2 mb-8">
          <FaRunning size={30} />
          <h1 className="inline font-bold text-2xl">Swole</h1>
          <h1 className="inline font-bold text-2xl text-blue-500">Query</h1>
        </div>
        <div className="relative flex items-center justify-center w-full h-12">
          <div className="absolute h-full z-1 bg-blue-100 border-r-blue-800 border-r-6 left-6 right-0 rounded-l-3xl" />
          <MdSpaceDashboard size={30} className="z-10" />
          <h2 className="font-semibold text-xl ml-1 z-10">DashBoard</h2>
        </div>
      </div>
      <div className="flex items-start w-full">
        <div className="w-full h-14 bg-zinc-100 m-4 rounded-lg flex justify-end items-center">
          <FaRegUserCircle size={40} className="mx-4" />
        </div>
        {Component}
      </div>
    </div>
  );
};

export default MainPage;
