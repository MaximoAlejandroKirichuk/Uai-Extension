import { useState } from "react";

import { DashboardUniversidades } from "../components/DashboardUniversidades/DasboardUniversidades";
import { ButtonAdd } from "../components/ButtonAdd/ButtonAdd";

import { DashboardCrowfunding } from "../components/DashboardCrowfunding/DashboardCrowfunding";
import { ButtonAddCrowfunding } from "../components/ButtonAddCrowfunding/ButtonAddCrowfunding";

import { DashboardCapitalVentures } from "../components/DashboardCapitalVentures/DashboardCapitalVentures";
import { ButtonAddCapitalVentures } from "../components/ButtonAddCV/ButtonAddCapitalVenture";
import { DashboardPlataformas } from "../components/DashboardPlataformas/DashboardPlataformas";
import { ButtonAddPlataformas } from "../components/ButtonAddPlataformas/ButtonAddPlataformas";
import { DashboardOrganismos } from "../components/DashboardOrganismosEstados/DasboardOrganismosEstados";
import { ButtonAddOrganismoEstado } from "../components/ButtonAddOrganismos/ButtonAddOrganismos";
import { DashboardEventos } from "../components/DashboardEventos/DashboardEventos";
import { DashboardIncubadoras } from "../components/DashboardIncubadoras/DashboardIncubadoras";

export const Home = () => {
  const [active, setActive] = useState("universidades");

  return (
    <div className="bg-gray-300 p-4 min-h-screen">
      {/* Menu de selección */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            active === "universidades" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setActive("universidades")}
        >
          Universidades
        </button>
        <button
          className={`px-4 py-2 rounded ${
            active === "crowfunding" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setActive("crowfunding")}
        >
          Crowfunding
        </button>
        <button
          className={`px-4 py-2 rounded ${
            active === "capitalVentures" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setActive("capitalVentures")}
        >
          Capital Ventures
        </button>

         <button
          className={`px-4 py-2 rounded ${
            active === "Plataformas" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setActive("Plataformas")}
        >
          Plataformas
        </button>
        <button
          className={`px-4 py-2 rounded ${
            active === "Organismos estados" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setActive("Organismos estados")}
        >
          Organismos estados
        </button>
        <button
          className={`px-4 py-2 rounded ${
            active === "Eventos" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setActive("Eventos")}
        >
          Eventos
        </button>
        <button
          className={`px-4 py-2 rounded ${
            active === "Incubadoras" ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setActive("Incubadoras")}
        >
          Incubadoras
        </button>
      </div>

      {/* Dashboards */}
      <div>
        {active === "universidades" && (
          <>
            <DashboardUniversidades />
            <ButtonAdd />
          </>
        )}
        {active === "crowfunding" && (
          <>
            <DashboardCrowfunding />
            <ButtonAddCrowfunding />
          </>
        )}
        {active === "capitalVentures" && (
          <>
            <DashboardCapitalVentures />
            <ButtonAddCapitalVentures />
          </>
        )}
        {active === "Plataformas" && (
          <>
            <DashboardPlataformas />
            <ButtonAddPlataformas />
          </>
        )}
        {active === "Organismos estados" && (
          <>
            <DashboardOrganismos />
            <ButtonAddOrganismoEstado />
          </>
        )}
        {active === "Eventos" && (
          <>
            <DashboardEventos />
          </>
        )}
        {active === "Incubadoras" && (
          <>
            <DashboardIncubadoras />
          </>
        )}
      </div>
    </div>
  );
};
