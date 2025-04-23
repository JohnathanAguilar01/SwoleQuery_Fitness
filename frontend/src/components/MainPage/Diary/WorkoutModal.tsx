import { useEffect, useState } from "react";
import { Workout } from "./Workouts";
import { Button } from "@/components/ui/button";
import Modal from "@/components/other/Modal";
import { Textarea } from "@/components/ui/textarea";
import AddExercise from "./AddExercise";
const apiUrl = `http://${import.meta.env.VITE_API_URL}`;

type WorkoutModalProps = {
  selectedWorkout: Workout;
};

function replaceUnderscores(input: string): string {
  return input.replace(/_/g, " ");
}

const WorkoutModal: React.FC<WorkoutModalProps> = ({ selectedWorkout }) => {
  const [exercises, setExercises] = useState<any>([]);
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [note, setNote] = useState<string>(selectedWorkout.notes);

  useEffect(() => {
    // Only fetch if required params are present
    const urlWithParams = `${apiUrl}/exercises/search/exercise?workout_id=${selectedWorkout.workout_id}`;
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
  }, [selectedWorkout, isAddExerciseOpen]);

  const addExercise = () => {
    setIsAddExerciseOpen(!isAddExerciseOpen);
  };

  const onUpdate = async () => {
    const urlWithParams = `${apiUrl}/workouts/update`;
    try {
      const response = await fetch(urlWithParams, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workout_id: selectedWorkout.workout_id,
          notes: note,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      }
      setIsEditable(!isEditable);
    } catch (err) {
      console.log(err.message);
    }
  };

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
      {isEditable ? (
        <div className="text-base border-t-2 p-2 max-w-300">
          <Textarea
            className="mb-4 resize-none min-h-24 min-w-200"
            defaultValue={selectedWorkout.notes}
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
              onClick={() => setIsAddExerciseOpen(!isAddExerciseOpen)}
            >
              Add Exercise
            </Button>
          </div>
        </>
      )}
      <Modal
        isOpen={isAddExerciseOpen}
        onClose={() => setIsAddExerciseOpen(!isAddExerciseOpen)}
      >
        <AddExercise
          workoutId={selectedWorkout.workout_id}
          onClose={() => setIsAddExerciseOpen(!isAddExerciseOpen)}
        />
      </Modal>
    </>
  );
};

export default WorkoutModal;
