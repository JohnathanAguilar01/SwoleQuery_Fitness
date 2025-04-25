import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";
const apiUrl = import.meta.env.VITE_API_URL;
const addMealUrl = new URL("/meals/add", `http://${apiUrl}`);

type AddMealProps = {
  date: string;
  onClose: () => void;
};

const AddMeal: React.FC<AddMealProps> = ({ date, onClose }) => {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [calories, setCalories] = useState<string | null>(null);
  const [protein, setProtein] = useState<string | null>(null);
  const [carbs, setCarbs] = useState<string | null>(null);
  const [fats, setFats] = useState<string | null>(null);
  const { user } = useUser();

  const onAdd = async () => {
    setError("");

    try {
      const response = await fetch(addMealUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          meal_date: date,
          calories: calories,
          protein: protein,
          carbs: carbs,
          fats: fats,
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
    <>
      <h1 className="font-bold mx-auto w-fit mb-4 text-xl">New Meal</h1>
      <div className="min-w-96 space-y-2">
        {error && <p className="text-red-500">{error}</p>}
        <h3 className="mb-2">Note:</h3>

        <Input
          type="number"
          placeholder="Calories (required)"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Protein"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Carbs"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Fats"
          value={fats}
          onChange={(e) => setFats(e.target.value)}
        />

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
    </>
  );
};

export default AddMeal;
