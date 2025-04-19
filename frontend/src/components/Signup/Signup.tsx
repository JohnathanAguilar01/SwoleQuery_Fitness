import { Input } from "@/components/ui/input";
import { FaRunning } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { sleep } from "@/utils/utils";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
const apiUrl = import.meta.env.VITE_API_URL;
const protocol = import.meta.env.PROD ? 'https' : 'http';
const signupUrl = new URL("/user/signup", `${protocol}://${apiUrl}`);

export default function Signup() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successfulSignup, setSuccessfulSignup] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUser(); // 👈 added here

    useEffect(() => {
        if (successfulSignup) {
          const timer = setTimeout(() => navigate("/login"), 2000);
      
          return () => clearTimeout(timer);
        }
      }, [successfulSignup, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        await sleep(1000);

        try {
            const response = await fetch(signupUrl.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    first_name : firstname,
                    last_name: lastname,
                    username: username,
                    email: email,
                    password: password,
                    height: height,
                    weight: weight,
                }),
            });

            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.error || "Unknown error");
            }
            
            setUser(null);
            setSuccessfulSignup(true);
            setIsLoading(false);
        }catch(err){
            if(err instanceof Error){
                setError(err.message);
            }else{
                setError("An unexpected error occured");
            }
            setIsLoading(false);
        }
    };

    return(
        <>
            <div className="flex justify-center items-center w-screen h-screen bg-zinc-200">
                <form
                onSubmit={handleSignup}
                className="flex flex-col items-center w-lg bg-white rounded-xl p-12"
                >
                    <div className="flex justify-center items-center mt-2 mb-14">
                        <FaRunning size={60} />
                        <h1 className="inline font-bold text-4xl">Swole</h1>
                        <h1 className="inline font-bold text-4xl text-blue-500">Query</h1>
                    </div>
                    <h1 className="text-center text-3xl font-semibold mb-4">SIGN UP</h1>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    {successfulSignup && <p className="text-green-500 mb-4">Signed Up!</p>}
                    <Input
                        type="text"
                        id="firstname"
                        placeholder="First name"
                        className="w-96 mx-auto my-4"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required
                    />
                    <Input
                        type="text"
                        id="lastname"
                        placeholder="Last name"
                        className="w-96 mx-auto my-4"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required
                    />
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
                        type="email"
                        id="email"
                        placeholder="Email"
                        className="w-96 mx-auto my-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <Input
                        type="number"
                        id="height"
                        placeholder="Height (cm)"
                        className="w-96 mx-auto my-4"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />
                    <Input
                        type="number"
                        id="weight"
                        placeholder="Weight (kg)"
                        className="w-96 mx-auto my-4"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="outline"
                        className="w-36"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing Up..." : "Signup"}
                    </Button>
                    <p className="mt-6 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Log&nbsp;in
                        </Link>
                        .
                    </p>
                </form>
            </div>
        </>
    );
}