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
import {
  InternalPortalShell,
  ModuleNav,
  type HomeModuleConfig,
} from "../components/internal-shell";

const HOME_MODULES: HomeModuleConfig[] = [
  {
    key: "universidades",
    label: "Universidades",
    render: () => (
      <>
        <DashboardUniversidades />
        <ButtonAdd />
      </>
    ),
  },
  {
    key: "crowfunding",
    label: "Financiamiento colectivo",
    render: () => (
      <>
        <DashboardCrowfunding />
        <ButtonAddCrowfunding />
      </>
    ),
  },
  {
    key: "capitalVentures",
    label: "Capital de riesgo",
    render: () => (
      <>
        <DashboardCapitalVentures />
        <ButtonAddCapitalVentures />
      </>
    ),
  },
  {
    key: "Plataformas",
    label: "Plataformas",
    render: () => (
      <>
        <DashboardPlataformas />
        <ButtonAddPlataformas />
      </>
    ),
  },
  {
    key: "Organismos estados",
    label: "Organismos estatales",
    render: () => (
      <>
        <DashboardOrganismos />
        <ButtonAddOrganismoEstado />
      </>
    ),
  },
  {
    key: "Eventos",
    label: "Eventos",
    render: () => <DashboardEventos />,
  },
  {
    key: "Incubadoras",
    label: "Incubadoras",
    render: () => <DashboardIncubadoras />,
  },
];

export const Home = () => {
  const [active, setActive] = useState(HOME_MODULES[0].key);

  const activeModule = HOME_MODULES.find((module) => module.key === active) ?? HOME_MODULES[0];

  return (
    <InternalPortalShell
      title="Portal interno institucional"
      description="Seleccione un módulo para trabajar con las superficies internas actuales y conservar los patrones de acceso existentes."
      navigation={
        <ModuleNav modules={HOME_MODULES} activeKey={activeModule.key} onChange={setActive} />
      }
    >
      <div className="space-y-6">{activeModule.render()}</div>
    </InternalPortalShell>
  );
};
