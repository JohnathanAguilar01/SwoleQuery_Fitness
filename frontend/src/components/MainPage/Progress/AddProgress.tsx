import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
const apiUrl = import.meta.env.VITE_API_URL;
const addProgressUrl = new URL("/progress/add", `http://${apiUrl}`);

type AddMealProps = {
  onClose: () => void;
};

const AddProgress: React.FC<AddMealProps> = ({ onClose }) => {
  const { user, setUser } = useUser();
  const [error, setError] = useState("");
  const [weight, setWeight] = useState<string>(user?.weight);
  const [bodyFat, setBodyFat] = useState<string | null>(null);
  const [muscleMass, setMuscleMass] = useState<string | null>(null);
  const now = new Date();

  const onAdd = async () => {
    setError("");

    try {
      const response = await fetch(addProgressUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          recorded_at: now.toISOString().split("T")[0],
          weight: weight,
          body_fat_percentage: bodyFat,
          muscle_mass: muscleMass,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      setUser({ ...user, weight: weight });
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <h1 className="font-bold mx-auto w-fit mb-4 text-xl">New Progress</h1>
      <div className="min-w-96 space-y-2">
        {error && <p className="text-red-500">{error}</p>}
        <h3 className="mb-2">Note:</h3>

        <Input
          type="number"
          placeholder="Weight (required)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Body Fat %"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Muscle Mass"
          value={muscleMass}
          onChange={(e) => setMuscleMass(e.target.value)}
        />

        <Button className="block bg-blue-400 mx-auto font-bold" onClick={onAdd}>
          ADD
        </Button>
      </div>
    </>
  );
};

export default AddProgress;
