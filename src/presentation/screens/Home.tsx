import { ButtonAdd } from "../components/ButtonAdd/ButtonAdd"
import { DashboardUniversidades } from "../components/DashboardUniversidades/DasboardUniversidades"

export const Home = () => {
  return (
    <div className="bg-gray-300">
      
      <DashboardUniversidades/>
      <ButtonAdd/>
    </div>
  )
}
