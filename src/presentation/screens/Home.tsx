import { useState, type ReactNode } from "react";
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
import { useAppSelector } from "../../hooks/hooks";
import type { RootState } from "../../store/store";
import { resolveCanWrite } from "../../core/entities/session-access";

type WritableHomeModuleConfig = Omit<HomeModuleConfig, "render"> & {
  render: (canWrite: boolean) => ReactNode;
};

const HOME_MODULES: WritableHomeModuleConfig[] = [
  {
    key: "universidades",
    label: "Universidades",
    render: (canWrite) => (
      <>
        <DashboardUniversidades canWrite={canWrite} />
        <ButtonAdd canWrite={canWrite} />
      </>
    ),
  },
  {
    key: "crowfunding",
    label: "Financiamiento colectivo",
    render: (canWrite) => (
      <>
        <DashboardCrowfunding canWrite={canWrite} />
        <ButtonAddCrowfunding canWrite={canWrite} />
      </>
    ),
  },
  {
    key: "capitalVentures",
    label: "Capital de riesgo",
    render: (canWrite) => (
      <>
        <DashboardCapitalVentures canWrite={canWrite} />
        <ButtonAddCapitalVentures canWrite={canWrite} />
      </>
    ),
  },
  {
    key: "Plataformas",
    label: "Plataformas",
    render: (canWrite) => (
      <>
        <DashboardPlataformas canWrite={canWrite} />
        <ButtonAddPlataformas canWrite={canWrite} />
      </>
    ),
  },
  {
    key: "Organismos estados",
    label: "Organismos estatales",
    render: (canWrite) => (
      <>
        <DashboardOrganismos canWrite={canWrite} />
        <ButtonAddOrganismoEstado canWrite={canWrite} />
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
  // Derive write capability from the session user, preferring the centralized
  // demo-email guard so the readonly demo account stays readonly even when the
  // Firebase custom claim is missing or stale.
  const user = useAppSelector((state: RootState) => state.user.value.user);
  const canWrite = user
    ? resolveCanWrite(user.emailUser, user.readonly)
    : false;

  const activeModule = HOME_MODULES.find((module) => module.key === active) ?? HOME_MODULES[0];

  return (
    <InternalPortalShell
      title="Portal interno institucional"
      description="Seleccione un módulo para trabajar con las superficies internas actuales y conservar los patrones de acceso existentes."
      navigation={
        <ModuleNav modules={HOME_MODULES} activeKey={activeModule.key} onChange={setActive} />
      }
    >
      <div className="space-y-6">{activeModule.render(canWrite)}</div>
    </InternalPortalShell>
  );
};
