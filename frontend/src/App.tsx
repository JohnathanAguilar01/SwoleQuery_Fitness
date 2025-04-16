import { useUser } from "./context/UserContext";
import MainPage from "./components/MainPage/MainPage";
import DashBoard from "./components/MainPage/Dashboard";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";

function App() {
  const { user } = useUser();

  if (!user) {
    return <Signup />;
  }
  return (
    <>
      <MainPage>
        <DashBoard />
      </MainPage>
    </>
  );
}

export default App;
