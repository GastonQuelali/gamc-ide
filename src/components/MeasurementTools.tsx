import type { MeasurementTool } from "../types/map.types";

interface MeasurementToolsProps {
  onMeasure: (tool: MeasurementTool) => void;
}

const MeasurementTools = ({ onMeasure }: MeasurementToolsProps) => {
  return (
    <div className="measurement-tools">
      <button className="esri-button" onClick={() => onMeasure("distance")}>
        Regla
      </button>
      <button className="esri-button" onClick={() => onMeasure("area")}>
        Área
      </button>
      <button
        className="esri-button esri-button--secondary"
        onClick={() => onMeasure("clear")}
      >
        Limpiar
      </button>
    </div>
  );
};

export default MeasurementTools;
