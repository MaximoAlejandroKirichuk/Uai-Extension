import { useSelector } from "react-redux";
import { Home } from "./presentation/screens/Home";
import { Login } from "./presentation/screens/Login"
import { RootState } from "./store/store";


function App() {
  const {value} = useSelector((state: RootState) => state.user);
  return (
    value.user ? <Home/> : <Login/>
  )
}

export default App
