import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";

function App() {
  const { user } = useContext(AuthContext);

  return user ? <Dashboard /> : <Landing />;
}

export default App;
