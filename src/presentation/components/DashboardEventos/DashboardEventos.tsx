import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { useEvents } from "../../../hooks/useEvents";
import type { ApiEvent } from "../../../core/entities/eventoEndeavor.entity";
import { EmptyState, ErrorState, LoadingState, SectionHeader } from "../internal-shell";

const formatValue = (value: string | null | undefined) => value || "No disponible";

const formatSourceName = (event: ApiEvent) => event.fuente?.nombre || "Fuente no disponible";

const EventStatus = ({ finalizado }: { finalizado: boolean }) => (
  <span className="inline-flex w-fit items-center rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
    {finalizado ? "Finalizado" : "Disponible"}
  </span>
);

const ExternalAction = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="group grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-left text-[color:var(--color-text)] transition hover:border-[color:var(--color-brand)] hover:bg-white focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
  >
    <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-full bg-white text-sm text-[color:var(--color-brand)] shadow-sm">
      ↗
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-semibold text-[color:var(--color-text)]">{label}</span>
      <span className="block truncate text-xs text-[color:var(--color-text-muted)] group-hover:text-[color:var(--color-text)]">
        {href}
      </span>
    </span>
    <span aria-hidden="true" className="text-lg text-[color:var(--color-text-muted)] transition group-hover:translate-x-0.5 group-hover:text-[color:var(--color-brand)]">
      ›
    </span>
  </a>
);

const SourceInfo = ({ event }: { event: ApiEvent }) => (
  <div className="min-w-0 rounded-2xl bg-[var(--color-surface)] px-3 py-2">
    <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">Fuente</dt>
    <dd className="mt-1 truncate text-sm font-medium text-[color:var(--color-text)]">Fuente: {formatSourceName(event)}</dd>
  </div>
);

const MetadataItem = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="min-w-0 rounded-2xl bg-[var(--color-surface)] px-3 py-2">
    <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">{label}</dt>
    <dd className="mt-1 truncate text-sm font-medium text-[color:var(--color-text)]">{children}</dd>
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

const EventCard = ({ event }: { event: ApiEvent }) => (
  <article className="flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] border border-[color:var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex flex-1 flex-col gap-5 p-5">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-brand)]">Evento</p>
          <EventStatus finalizado={event.finalizado} />
        </div>
        <h3 className="text-pretty break-words text-xl font-semibold leading-tight text-[color:var(--color-text)]">{event.nombre}</h3>
        <p className="line-clamp-3 text-sm leading-6 text-[color:var(--color-text-muted)]">{formatValue(event.descripcion)}</p>
      </div>

      <dl className="grid min-w-0 gap-3 text-sm sm:grid-cols-2">
        <MetadataItem label="Fecha">{formatDate(event.fecha_inicio)}</MetadataItem>
        <SourceInfo event={event} />
        <MetadataItem label="Modalidad">{formatValue(event.modalidad)}</MetadataItem>
      </dl>

      <div className="mt-auto space-y-2 border-t border-[color:var(--color-border)] pt-4">
        {event.url ? <ExternalAction href={event.url} label="Página del evento" /> : null}
        {event.fuente?.url ? <ExternalAction href={event.fuente.url} label="Sitio de la fuente" /> : null}
      </div>
    </div>

    <Link
      to={`/Home/eventos/${event.id}`}
      className="mx-5 mb-5 inline-flex justify-center rounded-full bg-[var(--color-brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[color:var(--color-focus)]/15"
    >
      Ver detalle
    </Link>
  </article>
);

export const DashboardEventos = () => {
  const { events, loading, error } = useEvents();

  return (
    <div className="space-y-6 pb-20">
      <SectionHeader
        title="Panel de eventos"
        description="Permite consultar los eventos disponibles en modo de solo lectura."
        actions={
          <div className="rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)]">
            {events.length} {events.length === 1 ? "evento" : "eventos"}
          </div>
        }
      />

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState
          title="No se pudieron cargar los eventos"
          description="El listado de eventos no está disponible en este momento. Intente nuevamente más tarde."
        />
      ) : events.length === 0 ? (
        <EmptyState
          title="No hay eventos disponibles"
          description="Todavía no hay eventos disponibles para consultar."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      )}
    </div>
  );
};
