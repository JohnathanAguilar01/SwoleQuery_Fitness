import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
const apiUrl = import.meta.env.VITE_API_URL;
const addWorkoutUrl = new URL("/workouts/add", `http://${apiUrl}`);

type AddWorkoutProps = {
  date: string;
  onClose: () => void;
};

const AddWorkout: React.FC<AddWorkoutProps> = ({ date, onClose }) => {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const { user } = useUser();

  const onAdd = async () => {
    setError("");

    try {
      const response = await fetch(addWorkoutUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          workout_date: date,
          notes: notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
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
    <div className="min-w-96">
      <h1 className="font-bold mx-auto w-fit mb-4 text-xl">New Workout</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h3 className="mb-2">Note:</h3>
      <Textarea
        className="mb-4 resize-none min-h-24"
        placeholder="Type your note here."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button className="block bg-blue-400 mx-auto font-bold" onClick={onAdd}>
        ADD
      </Button>
    </div>
  );
};

export default AddWorkout;
