import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

const apiUrl = import.meta.env.VITE_API_URL;
const addExerciseUrl = new URL("/exercises/add", `http://${apiUrl}`);

type AddExerciseProps = {
  workoutId: number;
  onClose: () => void;
};

const AddExercise: React.FC<AddExerciseProps> = ({ workoutId, onClose }) => {
  const [intensity, setIntensity] = useState<string>("");
  const [exerciseType, setExerciseType] = useState<
    "cardio" | "strength training"
  >("cardio");
  const [caloriesBurned, setCaloriesBurned] = useState<string>("");
  const [exerciseTime, setExerciseTime] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [sets, setSets] = useState<string>("");
  const [reps, setReps] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { user } = useUser();

  const onAdd = async () => {
    setError("");
    const payload: any = {
      user_id: user?.id,
      workout_id: workoutId,
      intensity,
      exercise_type: exerciseType,
      calories_burned: Number(caloriesBurned),
      ...(exerciseType === "cardio"
        ? { exercise_time: Number(exerciseTime) }
        : {}),
      ...(exerciseType === "strength training"
        ? { weight: Number(weight), sets: Number(sets), reps: Number(reps) }
        : {}),
    };

    try {
      const response = await fetch(addExerciseUrl.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Unknown error");
      }
      onClose();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-2">
      <h1 className="font-bold mx-auto w-fit mb-4 text-xl">New Exercise</h1>

      <Select
        value={exerciseType}
        onValueChange={(val) => setExerciseType(val as any)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cardio">Cardio</SelectItem>
          <SelectItem value="strength training">Strength Training</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder="Intensity"
        value={intensity}
        onChange={(e) => setIntensity(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Calories Burned"
        value={caloriesBurned}
        onChange={(e) => setCaloriesBurned(e.target.value)}
      />

      {exerciseType === "cardio" && (
        <Input
          type="number"
          placeholder="Exercise Time (min)"
          value={exerciseTime}
          onChange={(e) => setExerciseTime(e.target.value)}
        />
      )}

      {exerciseType === "strength training" && (
        <>
          <Input
            type="number"
            placeholder="Weight (lbs)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </>
      )}

      {error && <p className="w-fit text-red-600 mx-auto">missing field</p>}

      <Button className="block bg-blue-400 mx-auto font-bold" onClick={onAdd}>
        Add Exercise
      </Button>
    </div>
  );
};

export default AddExercise;
