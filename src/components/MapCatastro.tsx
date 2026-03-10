import { useMap } from "../hooks/useMap";
import MeasurementTools from "./MeasurementTools";
import type { MapAppProps } from "../types/map.types";
import "./MeasurementTools.css";
import "./MapCatastro.css";

const MapCatastro = ({ height = "100vh" }: MapAppProps) => {
  const { mapDivRef, setMeasureTool } = useMap();

  return (
    <div className="map-container" style={{ height }}>
      <div ref={mapDivRef} className="map-div" />
      <MeasurementTools onMeasure={setMeasureTool} />
    </div>
  );
};

export default MapCatastro;
