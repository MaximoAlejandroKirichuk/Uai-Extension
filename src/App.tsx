import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./presentation/screens/Home";
import { Login } from "./presentation/screens/Login"
import { RootState } from "./store/store";


function App() {
  const {value} = useSelector((state: RootState) => state.user);
  return (
    <Routes>
      <Route path="/" element={value.user ? <Navigate to="/Home" replace /> : <Login />} />
      <Route path="/Home" element={value.user ? <Home /> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to={value.user ? "/Home" : "/"} replace />} />
    </Routes>
  )
}

export default App
