export const SERVER_URL = "http://192.168.105.219:6080/arcgis/rest/services";

export const MAP_URLS = {
  predios: `${SERVER_URL}/catastro/predios_cba/MapServer`,
  manzanas: `${SERVER_URL}/catastro/manzanasdb/MapServer`,
  vias: `${SERVER_URL}/planificacion/vias/MapServer`,
  usoSuelo: `${SERVER_URL}/planificacion/usoSuelodb/MapServer`,
  img64: `${SERVER_URL}/imagenes/imagen1964_500/MapServer`,
  img94: `${SERVER_URL}/imagenes/CBA_1994_500/MapServer`,
  img00: `${SERVER_URL}/imagenes/imagen2000_500/MapServer`,
  img04: `${SERVER_URL}/imagenes/imagen_2004500/MapServer`,
  img07: `${SERVER_URL}/imagenes/imagen2007_500/MapServer`,
  img08: `${SERVER_URL}/imagenes/CBBA_2008_500/MapServer`,
  img09: `${SERVER_URL}/imagenes/imagen2009_500/MapServer`,
  img10: `${SERVER_URL}/imagenes/imagen2010_500/MapServer`,
  img11: `${SERVER_URL}/imagenes/imagen2011_500/MapServer`,
  img12: `${SERVER_URL}/imagenes/imagen2012_500/MapServer`,
  img13: `${SERVER_URL}/imagenes/imagen2013_500/MapServer`,
  img14: `${SERVER_URL}/imagenes/imagen2014_500/MapServer`,
  img15: `${SERVER_URL}/imagenes/imagen2015_500/MapServer`,
  img16: `${SERVER_URL}/imagenes/CBBA_2016_500/MapServer`,
  img17: `${SERVER_URL}/imagenes/imagen2017_500/MapServer`,
  img18: `${SERVER_URL}/imagenes/CBA_2018500/MapServer`,
  img19: `${SERVER_URL}/imagenes/imagen2019_500/MapServer`,
} as const;

export const INITIAL_EXTENT = {
  xmin: 792623.83,
  ymin: 8059312.67,
  xmax: 810149.87,
  ymax: 8090334.60,
  spatialReference: { wkid: 32719 } as const,
};

export const THUMBNAIL_BBOX = "792623,8059312,810149,8090334";

export const LAYER_OPACITY_STEP = 0.2;
export const MAX_OPACITY = 1;
export const MIN_OPACITY = 0;

export const HISTORICAL_YEAR_MAP: Record<string, string> = {
  img64: "1964",
  img94: "1994",
  img00: "2000",
  img04: "2004",
  img07: "2007",
  img08: "2008",
  img09: "2009",
  img10: "2010",
  img11: "2011",
  img12: "2012",
  img13: "2013",
  img14: "2014",
  img15: "2015",
  img16: "2016",
  img17: "2017",
  img18: "2018",
  img19: "2019",
};
