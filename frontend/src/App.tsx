import { useUser } from "./context/UserContext";
import MainPage from "./components/MainPage/MainPage";
import DashBoard from "./components/MainPage/Dashboard";
import Login from "./components/Login/Login";

function App() {
  const { user } = useUser();

  if (!user) {
    return <Login />;
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
