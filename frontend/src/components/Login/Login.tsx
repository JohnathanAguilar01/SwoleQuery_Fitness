import { Input } from "@/components/ui/input";
import { FaRunning } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen bg-zinc-200">
        <div className="flex flex-col items-center w-lg bg-white rounded-xl p-12">
          <div className="flex justify-center items-center mt-2 mb-14">
            <FaRunning size={60} />
            <h1 className="inline font-bold text-4xl">Swole</h1>
            <h1 className="inline font-bold text-4xl text-blue-500">Query</h1>
          </div>
          <h1 className="text-center text-3xl font-semibold mb-4">LOGIN</h1>
          <Input
            type="username"
            id="username"
            placeholder="Username"
            className="w-96 mx-auto my-4"
          />
          <Input
            type="password"
            id="password"
            placeholder="Password"
            className="w-96 mx-auto my-4"
          />
          <Button variant="outline" className="w-36">
            Login
          </Button>
        </div>
      </div>
    </>
  );
}
