import type { ReactNode } from "react";
import type { ArcapTraceable } from "../../../core/entities/arcap.entity";
import { DashboardItemCard } from "./DashboardItemCard";
import {
  dedupeSegments,
  describeLinkStatus,
  hasText,
  resolveSiteLink,
  toStringList,
} from "./arcapFields";

export interface ArcapField {
  label: string;
  value?: string;
}

export interface ArcapList {
  label: string;
  items: unknown;
}

type ArcapRecord = ArcapTraceable & { nombre: string; sitioWeb?: string };

interface ArcapRecordCardProps {
  record: ArcapRecord;
  id: string;
  /** Lead paragraph, usually the record's own description or quoted pitch. */
  lead?: string;
  fields: ArcapField[];
  lists?: ArcapList[];
  onDelete?: (id: string) => void;
  canDelete?: boolean;
}

const SOCIAL_LABELS: Array<[keyof NonNullable<ArcapRecord["redes"]>, string]> = [
  ["linkedin", "LinkedIn"],
  ["x", "X"],
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["youtube", "YouTube"],
  ["tiktok", "TikTok"],
];

const linkClassName =
  "text-sm font-medium text-[color:var(--color-brand)] underline decoration-[color:var(--color-border)] underline-offset-4 transition hover:opacity-80";

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs font-semibold text-[color:var(--color-text-muted)]">
    {children}
  </span>
);

/**
 * Card shared by the four ARCAP-fed collections.
 *
 * Only `nombre` is guaranteed on these records, so every field is dropped when
 * empty instead of printing a label with nothing after it, and the site is
 * linked only when it is reachable.
 *
 * The card shows no curation state. `estadoRevision` and `pendienteCuraduria`
 * stay on the record and still decide what reaches the card -- a value that is
 * not a literal transcription is withheld, and a superseded record is filtered
 * out by the dashboard -- but neither is labelled on screen.
 */
export const ArcapRecordCard = ({
  record,
  id,
  lead,
  fields,
  lists = [],
  onDelete,
  canDelete = false,
}: ArcapRecordCardProps) => {
  const siteLink = resolveSiteLink(record.sitioWeb, record.estadoLink);
  const visibleFields = fields
    .filter((field) => hasText(field.value))
    .map((field) => ({ label: field.label, value: dedupeSegments(field.value) }));
  const visibleLists = lists
    .map((list) => ({ label: list.label, items: toStringList(list.items) }))
    .filter((list) => list.items.length > 0);
  const socials = SOCIAL_LABELS.filter(([key]) => hasText(record.redes?.[key]));
  const leadText = dedupeSegments(lead);
  // A record can be nothing but a name: the load writes what the source
  // published and invents nothing. Say so rather than show an empty card.
  const isBare =
    !hasText(leadText) && visibleFields.length === 0 && visibleLists.length === 0;

  return (
    <DashboardItemCard
      title={record.nombre}
      deleteLabel={`Eliminar ${record.nombre}`}
      onDelete={() => onDelete?.(id)}
      canDelete={canDelete && Boolean(onDelete)}
      footer={
        <>
          {siteLink ? (
            <a href={siteLink} target="_blank" rel="noopener noreferrer" className={linkClassName}>
              Sitio web
            </a>
          ) : null}
          {socials.map(([key, label]) => (
            <a
              key={key}
              href={record.redes?.[key]}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClassName}
            >
              {label}
            </a>
          ))}
        </>
      }
    >
      {record.vehiculo ? (
        <div className="flex flex-wrap gap-2">
          <Badge>{record.vehiculo.replace(/_/g, " ")}</Badge>
        </div>
      ) : null}

      {hasText(leadText) ? <p>{leadText}</p> : null}

      {isBare ? (
        <p className="text-xs">
          Sin datos adicionales relevados. Solo se registro el nombre y la fuente.
        </p>
      ) : null}

      {visibleFields.map((field) => (
        <p key={field.label}>
          <span className="font-semibold">{field.label}:</span> {field.value}
        </p>
      ))}

      {visibleLists.map((list) => (
        <div key={list.label} className="space-y-1">
          <p className="font-semibold">
            {list.label} ({list.items.length})
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {list.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      {!siteLink && hasText(record.sitioWeb) ? (
        <p className="text-xs">
          <span className="font-semibold">Sitio no verificado:</span> {record.sitioWeb} (
          {describeLinkStatus(record.estadoLink)})
        </p>
      ) : null}

    </DashboardItemCard>
  );
};
