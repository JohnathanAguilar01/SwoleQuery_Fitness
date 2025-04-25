import { useEffect, useState } from "react";
import { Meal } from "./Meals";
import { Button } from "@/components/ui/button";
import Modal from "@/components/other/Modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import AddFoodItem from "./AddFoodItem";
const apiUrl = `http://${import.meta.env.VITE_API_URL}`;

type MealModalProps = {
  selectedMeal: Meal;
};

function replaceUnderscores(input: string): string {
  return input.replace(/_/g, " ");
}

const MealModal: React.FC<MealModalProps> = ({ selectedMeal }) => {
  const [foodItems, setFoodItems] = useState<any>([]);
  const [isAddFoodItemOpen, setIsAddFoodItemOpen] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [calories, setCalories] = useState<number>(selectedMeal.calories);
  const [protein, setProtein] = useState<number>(selectedMeal.protein);
  const [carbs, setCarbs] = useState<number>(selectedMeal.carbs);
  const [fats, setFats] = useState<number>(selectedMeal.fats);
  const [note, setNote] = useState<string>(selectedMeal.notes);

  useEffect(() => {
    // Only fetch if required params are present
    const urlWithParams = `${apiUrl}/food_items/search/meal?meal_id=${selectedMeal.meal_id}`;
    console.log("Fetching workouts from:", urlWithParams);

    fetch(urlWithParams)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setFoodItems(data.food_items))
      .catch((error) => console.error("Error fetching workouts:", error));
  }, [selectedMeal, isAddFoodItemOpen, isEditable]);

  const onUpdate = async () => {
    const urlWithParams = `${apiUrl}/meals/update`;

    try {
      const response = await fetch(urlWithParams, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal_id: selectedMeal.meal_id, // required
          calories: calories,
          protein: protein,
          carbs: carbs,
          fats: fats,
          notes: note,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }

      console.log("Meal updated successfully!");
      setIsEditable(false);
      // Optionally toggle UI state or refetch data
    } catch (err: any) {
      console.error("Update failed:", err.message);
    }
  };

  return (
    <>
      {isEditable ? (
        <>
          <div className="flex justify-between items-center px-2">
            <h1 className="text-xl font-semibold">
              Meal {selectedMeal.meal_id}
            </h1>
            <Input
              className="max-w-24 mb-2"
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
          <span>protein: </span>
          <Input
            className="inline max-w-24 mb-2 mr-2"
            type="number"
            placeholder="Protein"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <span>carbs: </span>
          <Input
            className="inline max-w-24 mb-2 mr-2"
            type="number"
            placeholder="Carbs"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <span>fats: </span>
          <Input
            className="inline max-w-24 mb-2 mr-2"
            type="number"
            placeholder="Fats"
            value={fats}
            onChange={(e) => setFats(e.target.value)}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between px-2">
            <h1 className="text-xl font-semibold">
              Meal {selectedMeal.meal_id}
            </h1>
            <p className="text-lg">{selectedMeal.calories}</p>
          </div>

          {Object.entries(selectedMeal).map(([key, value]) => {
            if (
              key === "meal_id" ||
              key === "user_id" ||
              key === "meal_date" ||
              key === "calories" ||
              key === "notes" ||
              value == null
            ) {
              return null;
            }

            return (
              <div key={key} className="inline p-2">
                <span>
                  {replaceUnderscores(key)}: {value}
                </span>
              </div>
            );
          })}
        </>
      )}
      {foodItems.length > 0 ? (
        foodItems.map((foodItem: any) => (
          <div>
            <div
              key={foodItem.food_id}
              className="flex justify-between border-t-2 px-4"
            >
              <p className="text-lg font-semibold">{foodItem.food_name}</p>
              <p>{foodItem.calories * foodItem.quantity}</p>
            </div>
            {Object.entries(foodItem).map(([key, value]) => {
              if (
                key === "food_id" ||
                key === "meal_id" ||
                key === "calories" ||
                key === "food_name" ||
                key === "created_at" ||
                value == null // 👈 skip null or undefined values
              ) {
                return null;
              }

              return (
                <div key={key} className="inline p-4">
                  <span>
                    {replaceUnderscores(key)}:{" "}
                    {["protein", "carbs", "fats"].includes(key)
                      ? value * foodItem.quantity
                      : value}
                  </span>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <div className="flex justify-center p-4 bg-white border-t-2">
          <p className="text-gray-500">No food items found for this meal</p>
        </div>
      )}
      {isEditable ? (
        <div className="text-base border-t-2 p-2 max-w-300">
          <Textarea
            className="mb-4 resize-none min-h-24 min-w-200"
            defaultValue={selectedMeal.notes}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />{" "}
          <Button
            className="block bg-blue-400 font-bold mx-auto"
            onClick={onUpdate}
          >
            Save
          </Button>
        </div>
      ) : (
        <>
          <p className="text-base border-t-2 p-2 max-w-300">Notes: {note}</p>
          <div className="flex justify-center ">
            <Button
              className="bg-blue-400 font-bold mx-4"
              onClick={() => setIsEditable(!isEditable)}
            >
              edit
            </Button>
            <Button
              className="bg-blue-400 font-bold mx-4"
              onClick={() => setIsAddFoodItemOpen(!isAddFoodItemOpen)}
            >
              Add Food Item
            </Button>
          </div>
        </>
      )}
      <Modal
        isOpen={isAddFoodItemOpen}
        onClose={() => setIsAddFoodItemOpen(!isAddFoodItemOpen)}
      >
        <AddFoodItem
          mealId={selectedMeal.meal_id}
          onClose={() => setIsAddFoodItemOpen(!isAddFoodItemOpen)}
        />
      </Modal>
    </>
  );
};

export default MealModal;
