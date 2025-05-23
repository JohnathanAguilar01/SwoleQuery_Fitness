import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import Modal from "@/components/other/Modal";
import AddWorkout from "./AddWorkout";
import WorkoutModal from "./WorkoutModal";

type WorkoutsProps = {
  date: string;
};

export type Workout = {
  workout_id: number;
  user_id: number;
  workout_date: string; // ISO string, can be parsed into a Date
  notes: string;
};

const Workouts: React.FC<WorkoutsProps> = ({ date }) => {
  const { user } = useUser();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    const apiUrl = `http://${import.meta.env.VITE_API_URL}/workouts/search/by-user-date-single`;

    // Only fetch if required params are present
    const urlWithParams = `${apiUrl}?user_id=${user?.id}&workout_date=${date}`;
    console.log("Fetching workouts from:", urlWithParams);

    fetch(urlWithParams)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setWorkouts(data.workouts))
      .catch((error) => console.error("Error fetching workouts:", error));
  }, [user?.id, date, isAddOpen, selectedWorkout]);

  return (
    <div className="w-full bg-white rounded-lg mb-4">
      <div className="flex justify-center h-8 bg-zinc-100 rounded-t-lg">
        <h2 className="font-semibold text-xl">Workouts</h2>
      </div>
      {workouts.length > 0 ? (
        workouts.map((workout) => (
          <div
            key={workout.workout_id}
            className="flex justify-between p-4 bg-white shadow border border-gray-200"
          >
            <p
              className="text-lg font-bold"
              onClick={() => setSelectedWorkout(workout)}
            >
              Workout {workout.workout_id}
            </p>
            <p className="mt-2 w-150 line-clamp-4">Notes: {workout.notes}</p>
          </div>
        ))
      ) : (
        <div className="flex justify-center p-4 bg-white">
          <p className="text-gray-500">No workouts found for this date</p>
        </div>
      )}{" "}
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
        <AddWorkout date={date} onClose={() => setIsAddOpen(!isAddOpen)} />
      </Modal>
      {/* Modal for showing workouts */}
      <Modal
        isOpen={!!selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
      >
        {selectedWorkout && <WorkoutModal selectedWorkout={selectedWorkout} />}
      </Modal>
    </div>
  );
};

export default Workouts;
