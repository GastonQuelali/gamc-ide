import { useEffect, useRef, useCallback } from "react";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import Extent from "@arcgis/core/geometry/Extent";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";
import Basemap from "@arcgis/core/Basemap";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Expand from "@arcgis/core/widgets/Expand";
import LayerList from "@arcgis/core/widgets/LayerList";
import Search from "@arcgis/core/widgets/Search";
import Measurement from "@arcgis/core/widgets/Measurement";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import Home from "@arcgis/core/widgets/Home";
import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource";

import type { MeasurementTool } from "../types/map.types";
import {
  MAP_URLS,
  INITIAL_EXTENT,
  THUMBNAIL_BBOX,
} from "../config/mapConfig";
import {
  createPrediosPopupTemplate,
  PREDIO_LABEL_FIELD,
  LABEL_SYMBOL,
} from "../utils/popupTemplates";

export const useMap = () => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<Measurement | null>(null);
  const viewRef = useRef<MapView | null>(null);

  const setMeasureTool = useCallback((tool: MeasurementTool) => {
    if (!measurementRef.current) return;
    if (tool === "clear") {
      measurementRef.current.clear();
    } else {
      measurementRef.current.activeTool = tool;
    }
  }, []);

  const setupSearchWidget = (view: MapView, prediosLayer: FeatureLayer) => {
    const searchWidget = new Search({
      view,
      includeDefaultSources: false,
      sources: [
        new LayerSearchSource({
          layer: prediosLayer,
          searchFields: ["CodCat"],
          displayField: "CodCat",
          exactMatch: false,
          outFields: ["*"],
          name: "Predios",
          placeholder: "SSMMMPPP",
        }),
      ],
    });

    view.ui.add(
      new Expand({ view, content: searchWidget, expanded: true }),
      "top-right"
    );
  };

  const setupHomeAndCoordinates = (view: MapView) => {
    view.ui.add(new Home({ view }), "top-left");
    view.ui.add(
      new Expand({ view, content: new CoordinateConversion({ view }) }),
      "top-right"
    );
  };

  const setupLayerList = (view: MapView) => {
    const layerList = new LayerList({
      view,
      listItemCreatedFunction: (event) => {
        const { item } = event;
        item.actionsSections = [
          [
            {
              title: "Aumentar opacidad",
              className: "esri-icon-up",
              id: "inc-op",
            },
            {
              title: "Disminuir opacidad",
              className: "esri-icon-down",
              id: "dec-op",
            },
          ],
        ];
      },
    });

    layerList.on("trigger-action", (event) => {
      const layer = (event.item as { layer: { opacity: number } }).layer;
      if (event.action.id === "inc-op") {
        layer.opacity = Math.min(1, layer.opacity + 0.2);
      }
      if (event.action.id === "dec-op") {
        layer.opacity = Math.max(0, layer.opacity - 0.2);
      }
    });

    view.ui.add(
      new Expand({ view, content: layerList }),
      "bottom-left"
    );
  };

  const setupMeasurement = (view: MapView) => {
    const measurement = new Measurement({ view });
    measurementRef.current = measurement;
  };

  const setupBasemapGallery = (view: MapView) => {
    const historicalBasemaps = Object.entries(MAP_URLS)
      .filter(([key]) => key.startsWith("img"))
      .map(([key, url]) => {
        const yearSuffix = key.replace("img", "");
        const fullYear =
          parseInt(yearSuffix) > 50
            ? `19${yearSuffix}`
            : `20${yearSuffix}`;

        const generatedThumbnail = `${url}/export?bbox=${THUMBNAIL_BBOX}&bboxSR=32719&size=200,133&f=image`;

        return new Basemap({
          baseLayers: [new TileLayer({ url })],
          title: `Año ${fullYear}`,
          id: key,
          thumbnailUrl: generatedThumbnail,
        });
      })
      .reverse();

    const bgGallery = new BasemapGallery({
      view,
      source: historicalBasemaps,
    });

    view.ui.add(
      new Expand({
        view,
        group: "top-right",
        content: bgGallery,
      }),
      "bottom-right"
    );
  };

  useEffect(() => {
    if (!mapDivRef.current) return;

    const initializeMap = () => {
      const map = new Map({
        basemap: "dark-gray-vector",
      });

      const view = new MapView({
        container: mapDivRef.current!,
        map,
        constraints: { rotationEnabled: false },
        extent: new Extent(INITIAL_EXTENT),
      });

      viewRef.current = view;

      const prediosLayer = new FeatureLayer({
        url: MAP_URLS.predios,
        title: "Predios",
        outFields: ["*"],
        popupTemplate: createPrediosPopupTemplate(),
        labelingInfo: [
          {
            labelExpressionInfo: { expression: PREDIO_LABEL_FIELD },
            symbol: { ...LABEL_SYMBOL, type: "text" as const },
          },
        ],
      });

      const usoSueloLayer = new MapImageLayer({
        url: MAP_URLS.usoSuelo,
        title: "Uso de Suelo",
        opacity: 0.5,
        visible: true,
      });

      map.addMany([usoSueloLayer, prediosLayer]);

      setupSearchWidget(view, prediosLayer);
      setupHomeAndCoordinates(view);
      setupLayerList(view);
      setupMeasurement(view);
      setupBasemapGallery(view);
    };

    initializeMap();

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
      }
    };
  }, []);

  return {
    mapDivRef,
    viewRef,
    measurementRef,
    setMeasureTool,
  };
};
