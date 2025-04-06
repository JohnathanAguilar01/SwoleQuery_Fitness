import { Input } from "@/components/ui/input";
import { FaRunning } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser, User } from "@/context/UserContext";
import { sleep } from "@/utils/utils";
const apiUrl = import.meta.env.VITE_API_URL;
const loginUrl = new URL("/user/login", `http://${apiUrl}`);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await sleep(1000); // pauses here for 1 second

    try {
      const response = await fetch(loginUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      const user = (await response.json()) as User;
      setUser(user);
      console.log(setUser);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center w-screen h-screen bg-zinc-200">
        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center w-lg bg-white rounded-xl p-12"
        >
          <div className="flex justify-center items-center mt-2 mb-14">
            <FaRunning size={60} />
            <h1 className="inline font-bold text-4xl">Swole</h1>
            <h1 className="inline font-bold text-4xl text-blue-500">Query</h1>
          </div>
          <h1 className="text-center text-3xl font-semibold mb-4">LOGIN</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Input
            type="text"
            id="username"
            placeholder="Username"
            className="w-96 mx-auto my-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            id="password"
            placeholder="Password"
            className="w-96 mx-auto my-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="outline"
            className="w-36"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </>
  );
}
