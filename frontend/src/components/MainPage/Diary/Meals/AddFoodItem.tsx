import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const apiUrl = import.meta.env.VITE_API_URL;
const addExerciseUrl = new URL("/food_items/add", `http://${apiUrl}`);

type AddFoodItemProps = {
  mealId: number;
  onClose: () => void;
};

const AddFoodItem: React.FC<AddFoodItemProps> = ({ mealId, onClose }) => {
  const [foodName, setFoodName] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<string | null>(null);
  const [unit, setUnit] = useState<string | null>(null);
  const [calories, setCalories] = useState<string | null>(null);
  const [protein, setProtein] = useState<string | null>(null);
  const [carbs, setCarbs] = useState<string | null>(null);
  const [fats, setFats] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const onAdd = async () => {
    setError("");
    const payload: any = {
      meal_id: mealId,
      food_name: foodName,
      quantity: quantity,
      unit: unit,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fats: fats,
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
      <h1 className="font-bold mx-auto w-fit mb-4 text-xl">New Food Item</h1>

      {error && <p className="w-fit text-red-600 mx-auto">missing field</p>}

      <Input
        placeholder="Food Name (required)"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Quantity (required)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Input
        placeholder="unit (required)"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      />

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

      <Button className="block bg-blue-400 mx-auto font-bold" onClick={onAdd}>
        Add Food Item
      </Button>
    </div>
  );
};

export default AddFoodItem;
