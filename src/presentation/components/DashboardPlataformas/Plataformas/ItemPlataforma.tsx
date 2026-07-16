import { Plataforma } from "../../../../core/entities/plataformas.entity";
import { DashboardItemCard } from "../../internal-shell";

interface Props {
  plataforma: Plataforma;
  id: string;
  onDelete: (id: string) => void;
}

export const ItemPlataforma = ({ plataforma, id, onDelete }: Props) => {
  return (
    <DashboardItemCard
      title={plataforma.nombrePlataforma}
      deleteLabel={`Eliminar ${plataforma.nombrePlataforma}`}
      onDelete={() => onDelete(id)}
    >
      <p>{plataforma.descripcion}</p>

      {plataforma.contacto ? (
        <p>
          <span className="font-semibold">Contacto:</span> {plataforma.contacto}
        </p>
      ) : null}

      <p>
        <span className="font-semibold">Tipo:</span> {plataforma.tipoPlataforma}
      </p>
      <p>
        <span className="font-semibold">Industria:</span> {plataforma.industria}
      </p>
      <p>
        <span className="font-semibold">Etapa:</span> {plataforma.etapaCubre}
      </p>
      <p>
        <span className="font-semibold">Monto promedio:</span> {plataforma.montoPromedio}
      </p>
      <p>
        <span className="font-semibold">Requisitos:</span> {plataforma.requisitosAcceso}
      </p>
      <p>
        <span className="font-semibold">Costo/Comisión:</span> {plataforma.costoComision}
      </p>
      <p>
        <span className="font-semibold">Algoritmo:</span> {plataforma.algoritmo}
      </p>
    </DashboardItemCard>
  );
};
