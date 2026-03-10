import type { SpatialReference } from "@arcgis/core/geometry";

export interface MapAppProps {
  height?: string;
}

export interface LayerConfig {
  url: string;
  title: string;
  outFields?: string[];
  visible?: boolean;
  opacity?: number;
}

export interface MapLayers {
  predios: LayerConfig;
  usoSuelo: LayerConfig;
}

export interface MapExtent {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  spatialReference: SpatialReference;
}

export interface UseMapReturn {
  mapDivRef: React.RefObject<HTMLDivElement>;
  view: __esri.MapView | null;
  measurement: __esri.Measurement | null;
  setMeasureTool: (tool: "distance" | "area" | "clear") => void;
}

export interface HistoricalBasemap {
  id: string;
  year: string;
  url: string;
  thumbnailUrl: string;
}

export type MeasurementTool = "distance" | "area" | "clear";

export interface LayerAction {
  id: string;
  title: string;
  className: string;
}

export interface PopupFieldInfo {
  fieldName: string;
  label: string;
  format?: {
    digitSeparator?: boolean;
    places?: number;
  };
}

export interface ExpressionInfo {
  name: string;
  title: string;
  expression: string;
}

export interface PopupContent {
  type: "fields";
  fieldInfos: PopupFieldInfo[];
}

export interface PopupConfig {
  title: string;
  outFields: string[];
  content: PopupContent[];
  expressionInfos?: ExpressionInfo[];
}
