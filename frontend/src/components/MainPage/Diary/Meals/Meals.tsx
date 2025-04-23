import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import Modal from "@/components/other/Modal";
// import AddWorkout from "./AddWorkout";
// import WorkoutModal from "./WorkoutModal";

type MealsProps = {
  date: string;
};

export type Meal = {
  meal_id: number;
  user_id: number;
  meal_date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  notes: string;
};

const Meals: React.FC<MealsProps> = ({ date }) => {
  const { user } = useUser();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  useEffect(() => {
    const apiUrl = `http://${import.meta.env.VITE_API_URL}/meals`;

    // Only fetch if required params are present
    const urlWithParams = `${apiUrl}/${user?.id}/day?date=${date}`;
    console.log("Fetching Meals from:", urlWithParams);

    fetch(urlWithParams)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setMeals(data))
      .catch((error) => console.error("Error fetching workouts:", error));
  }, [user?.id, date, isAddOpen, selectedMeal]);

  return (
    <div className="w-full bg-white rounded-lg mb-4">
      <div className="flex justify-center h-8 bg-zinc-100 rounded-t-lg">
        <h2 className="font-semibold text-xl">Meals</h2>
      </div>
      {meals.length > 0 ? (
        meals.map((meal) => (
          <div
            key={meal.meal_id}
            className="flex justify-between p-4 bg-white shadow border border-gray-200"
          >
            <p
              className="text-lg font-bold"
              onClick={() => setSelectedMeal(meal)}
            >
              Meal {meal.meal_id}
            </p>
            <p className="mt-2 w-150 line-clamp-4">Notes: {meal.notes}</p>
          </div>
        ))
      ) : (
        <div className="flex justify-center p-4 bg-white">
          <p className="text-gray-500">No meals found for this date</p>
        </div>
      )}
      <div className="flex justify-center h-8 bg-zinc-100 rounded-b-lg">
        <h2
          className="font-semibold text-blue-500 text-lg"
          onClick={() => setIsAddOpen(true)}
        >
          ADD
        </h2>
      </div>
      {/* Modal for adding workout */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(!isAddOpen)}>
        {/*
        <AddWorkout date={date} onClose={() => setIsAddOpen(!isAddOpen)} />
        */}
        <h1>add meal</h1>
      </Modal>
      {/* Modal for showing workouts */}
      <Modal isOpen={!!selectedMeal} onClose={() => setSelectedMeal(null)}>
        {/* selectedWorkout && <WorkoutModal selectedWorkout={selectedWorkout} /> */}
        <h1>meal this one</h1>
      </Modal>
    </div>
  );
};

export default Meals;
