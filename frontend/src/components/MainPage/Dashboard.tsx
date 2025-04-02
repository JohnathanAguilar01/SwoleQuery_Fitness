interface DashBoard {
  component: React.ComponentType<any>; // or use generics for more strict props
}

const DashBoard: React.FC<DashBoard> = () => {
  return (
    <>
      {/* Meals sections */}
      <div className="w-full bg-white rounded-lg mb-4">
        <div className="flex justify-center h-8 bg-zinc-100 rounded-t-lg">
          <h2 className="font-semibold text-xl">Meals</h2>
        </div>
        <div className="bg-white h-24"></div>
        <div className="flex justify-center h-8 bg-zinc-100 rounded-b-lg">
          <h2 className="font-semibold text-blue-500 text-lg">ADD</h2>
        </div>
      </div>

      {/* Workout sections */}
      <div className="w-full bg-white rounded-lg mb-4">
        <div className="flex justify-center h-8 bg-zinc-100 rounded-t-lg">
          <h2 className="font-semibold text-xl">Workouts</h2>
        </div>
        <div className="bg-white h-24"></div>
        <div className="flex justify-center h-8 bg-zinc-100 rounded-b-lg">
          <h2 className="font-semibold text-blue-500 text-lg">ADD</h2>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
