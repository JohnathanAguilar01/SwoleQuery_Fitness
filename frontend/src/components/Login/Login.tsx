import { Input } from "@/components/ui/input";
import { FaRunning } from "react-icons/fa";

export default function Login() {
  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen bg-zinc-200">
        <div className="w-lg h-200 bg-white">
          <div className="flex justify-center items-center mt-2 mb-8">
            <FaRunning size={60} />
            <h1 className="inline font-bold text-4xl">Swole</h1>
            <h1 className="inline font-bold text-4xl text-blue-500">Query</h1>
          </div>
        </div>
      </div>
    </>
  );
}
