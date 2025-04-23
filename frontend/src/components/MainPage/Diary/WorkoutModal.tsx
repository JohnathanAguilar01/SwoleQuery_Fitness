import { useEffect, useState } from "react";
import { Workout } from "./Workouts";

type WorkoutModalProps = {
  selectedWorkout: Workout;
};

function replaceUnderscores(input: string): string {
  return input.replace(/_/g, " ");
}

const WorkoutModal: React.FC<WorkoutModalProps> = ({ selectedWorkout }) => {
  const [exercises, setExercises] = useState<any>([]);

  useEffect(() => {
    const apiUrl = `http://${import.meta.env.VITE_API_URL}/exercises/search/exercise`;

    // Only fetch if required params are present
    const urlWithParams = `${apiUrl}?workout_id=${selectedWorkout.workout_id}`;
    console.log("Fetching workouts from:", urlWithParams);

    fetch(urlWithParams)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setExercises(data.exercises))
      .catch((error) => console.error("Error fetching workouts:", error));
  }, [selectedWorkout]);

  return (
    <>
      <p className="text-lg font-semibold p-2">
        Workout {selectedWorkout.workout_id}
      </p>
      {exercises.length > 0 ? (
        exercises.map((exercise) => (
          <div>
            <div
              key={exercise.exercise_id}
              className="flex justify-between border-t-2 px-4"
            >
              <p className="text-lg font-bold">
                Exercise {exercise.exercise_id}
              </p>
              <p>{exercise.calories_burned}</p>
            </div>
            {Object.entries(exercise).map(([key, value]) => {
              if (
                key === "exercise_id" ||
                key === "calories_burned" ||
                value == null // 👈 skip null or undefined values
              ) {
                return null;
              }

              return (
                <div key={key} className="inline p-4">
                  <span>
                    {replaceUnderscores(key)}: {value}
                  </span>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <div className="flex justify-center p-4 bg-white border-t-2">
          <p className="text-gray-500">No exercises found for this workout</p>
        </div>
      )}
      <p className="text-base border-t-2 p-2 max-w-300">
        Notes: {selectedWorkout.notes}
      </p>
    </>
  );
};

export default WorkoutModal;
