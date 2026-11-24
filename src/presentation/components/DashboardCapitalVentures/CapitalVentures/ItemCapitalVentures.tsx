import type { CapitalVentures } from "../../../../core/entities/capitalVentures.entity";
import { ArcapRecordCard } from "../../internal-shell";

interface Props {
  venture: CapitalVentures;
  id: string;
  onDelete: (id: string) => void;
  canDelete?: boolean;
}

export const ItemCapitalVenture = ({ venture, id, onDelete, canDelete = true }: Props) => {
  return (
    <ArcapRecordCard
      id={id}
      record={venture}
      onDelete={onDelete}
      canDelete={canDelete}
      lead={venture.comentario}
      fields={[
        { label: "Contacto", value: venture.contacto },
        { label: "Region", value: venture.region },
        { label: "Tipo de inversion", value: venture.tipoInversion },
        { label: "Foco", value: venture.foco },
        { label: "Etapa", value: venture.etapa },
        { label: "Monto promedio", value: venture.montoPromedio },
        { label: "Perfil buscado", value: venture.perfilBuscado },
        { label: "Convocatoria", value: venture.convocatoria },
        { label: "Empresa de respaldo", value: venture.empresaRespaldo },
        { label: "Que busca para su negocio", value: venture.queBuscaParaSuNegocio },
        { label: "Programas", value: venture.programas },
        { label: "Algoritmo", value: venture.algoritmo },
      ]}
      lists={[{ label: "Portfolio declarado", items: venture.portfolio }]}
    />
  );
};
