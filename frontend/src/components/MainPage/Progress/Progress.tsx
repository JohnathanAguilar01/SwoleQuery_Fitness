import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "@/components/other/Modal";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import AddProgress from "./AddProgress";
const apiUrl = `http://${import.meta.env.VITE_API_URL}`;

interface Progress {
  progress_id: number;
  user_id: number;
  recorded_at: string; // ISO string
  weight: number;
  body_fat_percentage?: number | null;
  muscle_mass?: number | null;
}

export default function Progress() {
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useUser();

  useEffect(() => {
    // Only fetch if required params are present
    const urlWithParams = `${apiUrl}/progress/search/user?user_id=${user?.id}`;
    console.log("Fetching workouts from:", urlWithParams);

    fetch(urlWithParams)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setProgressData(data))
      .catch((error) => console.error("Error fetching workouts:", error));
  }, [user?.id, isOpen]);

  return (
    <div className="w-full flex flex-col overflow-x-auto p-4 bg-zinc-100 rounded-lg justify-end items-center mb-6">
      <Table className="border-b-1">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>Body Fat (%)</TableHead>
            <TableHead>Muscle Mass (kg)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {progressData.map((progress) => (
            <TableRow key={progress.progress_id}>
              <TableCell>
                {new Date(progress.recorded_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{Number(progress.weight).toFixed(2)}</TableCell>
              <TableCell>
                {progress.body_fat_percentage !== null
                  ? progress.body_fat_percentage
                  : "-"}
              </TableCell>
              <TableCell>
                {progress.muscle_mass !== null ? progress.muscle_mass : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        className="block bg-blue-400 mx-auto font-bold mt-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        ADD
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
        <AddProgress onClose={() => setIsOpen(!isOpen)} />
      </Modal>
    </div>
  );
}
