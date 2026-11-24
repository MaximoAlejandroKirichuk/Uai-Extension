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
import { DashboardIncubadoras } from "../components/DashboardIncubadoras/DashboardIncubadoras";
import { DashboardEventos } from "../components/DashboardEventos/DashboardEventos";
import { DashboardFondosPrivateEquity } from "../components/DashboardFondosPrivateEquity/DashboardFondosPrivateEquity";
import { DashboardProveedoresServicios } from "../components/DashboardProveedoresServicios/DashboardProveedoresServicios";
import { DashboardApoyoEmprendedor } from "../components/DashboardApoyoEmprendedor/DashboardApoyoEmprendedor";
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
    key: "fondosPrivateEquity",
    label: "Private equity y otros vehiculos",
    render: () => <DashboardFondosPrivateEquity />,
  },
  {
    key: "apoyoEmprendedor",
    label: "Apoyo al emprendedor",
    render: () => <DashboardApoyoEmprendedor />,
  },
  {
    key: "proveedoresServicios",
    label: "Proveedores de servicios",
    render: () => <DashboardProveedoresServicios />,
  },
  {
    key: "Incubadoras",
    label: "Incubadoras",
    render: () => <DashboardIncubadoras />,
  },
  {
    key: "eventos",
    label: "Eventos",
    render: () => <DashboardEventos />,
  },
];

export const Home = () => {
  const [active, setActive] = useState(HOME_MODULES[0].key);
  // Derive write capability from the session user, preferring the centralized
  // demo-email guard so the readonly demo account stays readonly even when the
  // Firebase custom claim is missing or stale.
  const user = useAppSelector((state: RootState) => state.user.value.user);
  const canWrite = user
    ? resolveCanWrite(user.emailUser, user.readonly, user.isAnonymous)
    : false;
  const isReadOnlySession = !canWrite;

  const activeModule = HOME_MODULES.find((module) => module.key === active) ?? HOME_MODULES[0];

  return (
    <InternalPortalShell
      title="Portal interno institucional"
      description="Seleccione un módulo para trabajar con las superficies internas actuales y conservar los patrones de acceso existentes."
      navigation={
        <ModuleNav modules={HOME_MODULES} activeKey={activeModule.key} onChange={setActive} />
      }
    >
      <div className="space-y-6">
        {isReadOnlySession ? (
          <section
            aria-label="Contexto de acceso de solo lectura"
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
          >
            <p className="font-semibold">
              {user?.isAnonymous ? "Acceso invitado de solo lectura" : "Acceso de solo lectura"}
            </p>
            <p className="mt-1">
              Podés consultar todos los módulos actuales, pero las acciones para crear, editar, eliminar, aprobar o subir datos están deshabilitadas.
            </p>
          </section>
        ) : null}
        {activeModule.render(canWrite)}
      </div>
    </InternalPortalShell>
  );
};
