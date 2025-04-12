import { useSelector } from "react-redux";
import { Home } from "./presentation/screens/Home";
import { Login } from "./presentation/screens/Login"
import { RootState } from "./store/store";


function App() {
  const {value} = useSelector((state: RootState) => state.user)
  return (
    // <div classNameName="flex justify-center items-center h-screen bg-gray-800">
    //   <h1 classNameName="text-center">Uai extension</h1>
    // </div>

    value.user ? <Home/> : <Login/>
  )
}

export default App
