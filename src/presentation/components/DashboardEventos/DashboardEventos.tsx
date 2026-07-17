import { EmptyState, SectionHeader } from "../internal-shell";

export const DashboardEventos = () => {
  return (
    <div className="space-y-6 pb-20">
      <SectionHeader
        title="Dashboard de Eventos"
        description="Esta sección todavía no tiene carga de datos ni acciones CRUD."
      />

      <EmptyState
        title="Módulo en preparación"
        description="Aquí se mostrará la vista de eventos cuando el flujo de datos esté disponible."
      />
    </div>
  );
};
