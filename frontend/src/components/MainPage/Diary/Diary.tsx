import { useEffect, useState } from "react";
import { format } from "date-fns";
import Workouts from "./Workouts";
import Meals from "./Meals";
import { DatePicker } from "@/components/ui/datepicker";

const Diary: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const dateString = format(date ?? new Date(), "yyyy-MM-dd");

  useEffect(() => {
    console.log(dateString);
  }, [dateString]);

  return (
    <>
      <DatePicker date={date} setDate={setDate} />
      <Workouts date={dateString} />
      <Meals />
    </>
  );
};

export default Diary;
