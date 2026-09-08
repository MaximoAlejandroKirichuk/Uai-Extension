import { Link, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { useEventDetail } from "../../hooks/useEventDetail";
import { EmptyState, ErrorState, InternalPortalShell, LoadingState } from "../components/internal-shell";

const formatValue = (value: string | null | undefined) => value || "No disponible";

const formatSourceName = (value: { nombre: string } | null) => value?.nombre || "Fuente no disponible";

const EventStatus = ({ finalizado }: { finalizado: boolean }) => (
  <span className="inline-flex w-fit items-center rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
    {finalizado ? "Finalizado" : "Disponible"}
  </span>
);

const ExternalAction = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="group grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] px-4 py-3 text-left text-[color:var(--color-text)] transition hover:border-[color:var(--color-brand)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
  >
    <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-[var(--color-surface)] text-sm text-[color:var(--color-brand)]">
      ↗
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-[color:var(--color-text)]">{label}</span>
      <span className="block break-all text-xs leading-5 text-[color:var(--color-text-muted)] group-hover:text-[color:var(--color-text)]">
        {href}
      </span>
    </span>
    <span aria-hidden="true" className="text-xl text-[color:var(--color-text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--color-brand)]">›</span>
  </a>
);

const MetadataCard = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="min-w-0 rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-surface)] p-4">
    <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">{label}</dt>
    <dd className="mt-2 break-words text-sm font-medium text-[color:var(--color-text)]">{children}</dd>
  </div>
);

const formatDate = (value: string | null) => {
  if (!value) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
  }).format(new Date(value));
};

export const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error, notFound } = useEventDetail(id);

  return (
    <InternalPortalShell
      title="Detalle del evento"
      description="Permite consultar la información del evento en modo de solo lectura."
      navigation={
        <Link
          to="/Home"
          className="inline-flex rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text)] transition hover:bg-[var(--color-surface-muted)] focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
        >
          Volver al portal
        </Link>
      }
    >
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          title="No se pudo cargar el detalle del evento"
          description="El evento seleccionado no está disponible en este momento. Intente nuevamente más tarde."
        />
      ) : notFound ? (
        <EmptyState
          title="Evento no encontrado"
          description="El evento seleccionado no existe o ya no está disponible."
        />
      ) : event ? (
        <article className="min-w-0 overflow-hidden rounded-[2rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm">
          <header className="border-b border-[color:var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">Detalle del evento</p>
                <h2 className="text-pretty break-words text-2xl font-semibold leading-tight text-[color:var(--color-text)] sm:text-3xl">
                  {event.nombre}
                </h2>
              </div>
              <EventStatus finalizado={event.finalizado} />
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[color:var(--color-text-muted)] sm:text-base">
              {formatValue(event.descripcion)}
            </p>
          </header>

          <div className="space-y-7 p-5 sm:p-7">
            <section aria-labelledby="event-metadata-title" className="space-y-4">
              <div>
                <h3 id="event-metadata-title" className="text-lg font-semibold text-[color:var(--color-text)]">
                  Información general
                </h3>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  Datos principales del evento y su fuente de publicación.
                </p>
              </div>
              <dl className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MetadataCard label="Fecha de inicio">{formatDate(event.fecha_inicio)}</MetadataCard>
                <MetadataCard label="Fecha de finalización">{formatDate(event.fecha_fin)}</MetadataCard>
                <MetadataCard label="Ubicación">{formatValue(event.ubicacion)}</MetadataCard>
                <MetadataCard label="Categoría">{formatValue(event.categoria)}</MetadataCard>
                <MetadataCard label="Modalidad">{formatValue(event.modalidad)}</MetadataCard>
                <MetadataCard label="Costo">{formatValue(event.costo_entrada)}</MetadataCard>
                <MetadataCard label="Fuente">Fuente: {formatSourceName(event.fuente)}</MetadataCard>
              </dl>
            </section>

            <section aria-labelledby="event-links-title" className="space-y-4">
              <div>
                <h3 id="event-links-title" className="text-lg font-semibold text-[color:var(--color-text)]">
                  Enlaces relacionados
                </h3>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  Accesos externos del evento y de la fuente, con URLs controladas para evitar desbordes.
                </p>
              </div>
              <div className="grid min-w-0 gap-3 lg:grid-cols-2">
                {event.url ? <ExternalAction href={event.url} label="Página del evento" /> : null}
                {event.fuente?.url ? <ExternalAction href={event.fuente.url} label="Sitio de la fuente" /> : null}
                {event.url_detalles ? <ExternalAction href={event.url_detalles} label="Detalle adicional" /> : null}
              </div>
            </section>
          </div>
        </article>
      ) : null}
    </InternalPortalShell>
  );
};
