// import { ButtonAdd } from "../components/ButtonAdd/ButtonAdd"
// import { DashboardUniversidades } from "../components/DashboardUniversidades/DasboardUniversidades"
import { DashboardCrowfunding } from "../components/DashboardCrowfunding/DashboardCrowfunding"
import { ButtonAddCrowfunding } from "../components/ButtonAddCrowfunding/ButtonAddCrowfunding"

export const Home = () => {
  return (
    <div className="bg-gray-300">
      {/* <DashboardUniversidades/> */}
      {/* <ButtonAdd/> */}
      <DashboardCrowfunding/>
      <ButtonAddCrowfunding/>
    </div>
  )
}
