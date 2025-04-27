import { useUser } from "@/context/UserContext";

const DashBoard: React.FC = () => {
  const { user } = useUser();

  return (
    <>
      <div className="flex flex-col w-full bg-zinc-100 rounded-lg items-center mb-6">
        <h1 className="font-semibold text-lg mb-2">
          {user?.first_name + "'s Information"}
        </h1>
        <div className="flex space-x-12 justify-center w-full px-12 mb-2">
          <span>First Name: {user?.first_name}</span>
          <span>Last Name: {user?.last_name}</span>
          <span>Username: {user?.username}</span>
          <span>Height: {user?.height}</span>
          <span>Weight: {user?.weight}</span>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
