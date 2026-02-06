import React, { useEffect, useRef } from 'react';
import '@arcgis/core/assets/esri/themes/dark/main.css';

import esriConfig from "@arcgis/core/config";

// Core
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Extent from '@arcgis/core/geometry/Extent';

// Layers
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import TileLayer from '@arcgis/core/layers/TileLayer';
import Basemap from '@arcgis/core/Basemap';

// Widgets
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Expand from '@arcgis/core/widgets/Expand';
import LayerList from '@arcgis/core/widgets/LayerList';
import Search from '@arcgis/core/widgets/Search';
import Measurement from '@arcgis/core/widgets/Measurement';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion';
import Home from '@arcgis/core/widgets/Home';
import Legend from '@arcgis/core/widgets/Legend';
import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource";

// --- Interfaces para TypeScript ---
interface MapAppProps {
  height?: string;
}

const ArcGISMap: React.FC<MapAppProps> = ({ height = "100vh" }) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<Measurement | null>(null);
  const viewRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (!mapDivRef.current) return;

    // 1. Definición de URLs (Manteniendo tus servicios locales)
    const serverUrl = "http://192.168.105.219:6080/arcgis/rest/services";
    const urls = {
      predios: `${serverUrl}/catastro/predios_cba/MapServer`,
      manzanas: `${serverUrl}/catastro/manzanasdb/MapServer`,
      vias: `${serverUrl}/planificacion/vias/MapServer`,
      usoSuelo: `${serverUrl}/planificacion/usoSuelodb/MapServer`,
      // Histórico de imágenes (Mapeo limpio)
      img64: `${serverUrl}/imagenes/imagen1964_500/MapServer`,
      img94: `${serverUrl}/imagenes/CBA_1994_500/MapServer`,
      img00: `${serverUrl}/imagenes/imagen2000_500/MapServer`,
      img04: `${serverUrl}/imagenes/imagen_2004500/MapServer`,
      img07: `${serverUrl}/imagenes/imagen2007_500/MapServer`,
      img08: `${serverUrl}/imagenes/CBBA_2008_500/MapServer`,
      img09: `${serverUrl}/imagenes/imagen2009_500/MapServer`,
      img10: `${serverUrl}/imagenes/imagen2010_500/MapServer`,
      img11: `${serverUrl}/imagenes/imagen2011_500/MapServer`,
      img12: `${serverUrl}/imagenes/imagen2012_500/MapServer`,
      img13: `${serverUrl}/imagenes/imagen2013_500/MapServer`,
      img14: `${serverUrl}/imagenes/imagen2014_500/MapServer`,
      img15: `${serverUrl}/imagenes/imagen2015_500/MapServer`,
      img16: `${serverUrl}/imagenes/CBBA_2016_500/MapServer`,
      img17: `${serverUrl}/imagenes/imagen2017_500/MapServer`,
      img18: `${serverUrl}/imagenes/CBA_2018500/MapServer`,
      img19: `${serverUrl}/imagenes/imagen2019_500/MapServer`,
    };

    // 2. Templates (PopupTemplates)
    const templatePredios = {
      title: "PREDIO {expression/codcat-format}",
      outFields: ["*"],
      content: [{
        type: "fields",
        fieldInfos: [
          { fieldName: "CodCat", label: "Código Catastral" },
          { fieldName: "Sbdistrito", label: "Nombre Subdistrito" },
          { fieldName: "SHAPE.STArea()", label: "Área", format: { digitSeparator: true, places: 2 } }
        ]
      }],
      expressionInfos: [{
        name: "codcat-format",
        title: "Código Catastral Formateado",
        expression: "Concatenate(Mid($feature.CodCat, 0, 2), '-', Mid($feature.CodCat, 2, 3), '-', Mid($feature.CodCat, 5, 3))"
      }]
    };

    // 3. Inicialización del Mapa y Capas
    const map = new Map({
      basemap: "dark-gray-vector"
    });

    const view = new MapView({
      container: mapDivRef.current,
      map: map,
      constraints: { rotationEnabled: false },
      extent: new Extent({
        xmin: 792623.83, ymin: 8059312.67, xmax: 810149.87, ymax: 8090334.60,
        spatialReference: { wkid: 32719 }
      })
    });
    viewRef.current = view;

    // 4. Carga de Capas (FeatureLayers y MapImageLayers)
    const prediosLayer = new FeatureLayer({
      url: urls.predios,
      title: "Predios",
      outFields: ["*"],
      popupTemplate: templatePredios,
      labelingInfo: [{
        labelExpressionInfo: { expression: "$feature.Nro_predio" },
        symbol: {
          type: "text",
          color: [64, 101, 235, 255],
          font: { size: "11px", family: "arial" }
        }
      }]
    });

    const usoSueloLayer = new MapImageLayer({
      url: urls.usoSuelo,
      title: "Uso de Suelo",
      opacity: 0.5,
      visible: true
    });

    map.addMany([usoSueloLayer, prediosLayer]);

    // 5. Configuración de Widgets

    // Search con múltiples fuentes
    const searchWidget = new Search({
      view: view,
      includeDefaultSources: false, // Opcional: para que solo busque en tus capas
      sources: [
        new LayerSearchSource({
          layer: prediosLayer,
          searchFields: ["CodCat"],
          displayField: "CodCat",
          exactMatch: false,
          outFields: ["*"],
          name: "Predios",
          placeholder: "SSMMMPPP"
        })
      ]
    });
    view.ui.add(new Expand({ view, content: searchWidget, expanded: true }), "top-right");

    // Home y Coordenadas
    view.ui.add(new Home({ view }), "top-left");
    view.ui.add(new Expand({ view, content: new CoordinateConversion({ view }) }), "top-right");

    // LayerList con Acciones de Opacidad
    const layerList = new LayerList({
      view: view,
      listItemCreatedFunction: (event) => {
        const { item } = event;
        item.actionsSections = [[
          { title: "Aumentar opacidad", className: "esri-icon-up", id: "inc-op" },
          { title: "Disminuir opacidad", className: "esri-icon-down", id: "dec-op" }
        ]];
      }
    });
    layerList.on("trigger-action", (event) => {
      const layer = (event.item as any).layer;
      if (event.action.id === "inc-op") layer.opacity = Math.min(1, layer.opacity + 0.2);
      if (event.action.id === "dec-op") layer.opacity = Math.max(0, layer.opacity - 0.2);
    });
    view.ui.add(new Expand({ view, content: layerList }), "bottom-left");

    // Medición (Measurement)
    const measurement = new Measurement({ view: view });
    measurementRef.current = measurement;
    // No lo agregamos al UI todavía, lo controlaremos con botones externos

    // 6. Basemaps Personalizados (TileLayers)
    // Filtramos las URLs que empiezan con 'img' y creamos un Basemap por cada una
    const thumbBBox = "792623,8059312,810149,8090334";

    const historicalBasemaps = Object.entries(urls)
      .filter(([key]) => key.startsWith('img'))
      .map(([key, url]) => {
        const yearSuffix = key.replace('img', '');
        const fullYear = parseInt(yearSuffix) > 50 ? `19${yearSuffix}` : `20${yearSuffix}`;

        // CONSEJO PRO: Pedimos al ArcGIS Server una imagen estática del servicio
        // f=image: devuelve la imagen real, no un JSON
        // bbox: el área geográfica a capturar
        // size: tamaño de la miniatura en pixeles
        const generatedThumbnail = `${url}/export?bbox=${thumbBBox}&bboxSR=32719&size=200,133&f=image`;

        return new Basemap({
          baseLayers: [new TileLayer({ url: url })],
          title: `Año ${fullYear}`,
          id: key,
          thumbnailUrl: generatedThumbnail // <--- Ahora cada año tiene su propia foto real
        });
      })
      .reverse(); // Para que el 2019 salga primero

    const bgGallery = new BasemapGallery({
      view,
      source: historicalBasemaps
    });

    view.ui.add(new Expand({
      view,
      group: "top-right",
      content: bgGallery
    }), "bottom-right");

    // Cleanup
    return () => {
      view.destroy();
    };
  }, []);

  // --- Funciones de Medición ---
  const setMeasureTool = (tool: "distance" | "area" | "clear") => {
    if (!measurementRef.current) return;
    if (tool === "clear") {
      measurementRef.current.clear();
    } else {
      measurementRef.current.activeTool = tool;
    }
  };

  return (
    <div style={{ width: '100%', height, position: 'relative', overflow: 'hidden' }}>
      {/* Contenedor del Mapa */}
      <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />

      {/* Toolbar de Medición Flotante (React Puro) */}
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '60px',
        display: 'flex',
        gap: '5px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '10px',
        borderRadius: '4px',
        zIndex: 10
      }}>
        <button className="esri-button" onClick={() => setMeasureTool("distance")}>Regla</button>
        <button className="esri-button" onClick={() => setMeasureTool("area")}>Área</button>
        <button className="esri-button esri-button--secondary" onClick={() => setMeasureTool("clear")}>Limpiar</button>
      </div>

      <style>{`
        .esri-button { margin-bottom: 0; font-size: 12px; cursor: pointer; }
        .esri-expand__content { background-color: #242424 !important; }
      `}</style>
    </div>
  );
};

export default ArcGISMap;