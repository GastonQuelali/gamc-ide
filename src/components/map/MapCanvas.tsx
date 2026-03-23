import { useEffect, useRef, useState, useCallback } from "react"
import { Loader2, AlertCircle, Home } from "lucide-react"
import Map from "@arcgis/core/Map"
import MapView from "@arcgis/core/views/MapView"
import Extent from "@arcgis/core/geometry/Extent"
import TileLayer from "@arcgis/core/layers/TileLayer"
import type Layer from "@arcgis/core/layers/Layer"
import { useMapContext } from "@/context/MapContext"
import { INITIAL_EXTENT } from "@/config/mapConfig"
import { createCapaGis, sortCapasPorOrden } from "@/lib/layerFactory"
import { BasemapSelector } from "./BasemapSelector"
import { TOCFlotante } from "./TOCFlotante"
import { Button } from "@/components/ui/button"
import type { MapaConfig, CapaGis } from "@/types/mapa.types"

interface MapCanvasProps {
  config: MapaConfig | null
  loading: boolean
  error: string | null
}

const GRUPO_IMAGENES = "imagenes"

const MAX_CONCURRENT_LAYERS = 3

export function MapCanvas({ config, loading, error }: MapCanvasProps) {
  const mapDivRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<MapView | null>(null)
  const mapInitializedRef = useRef(false)
  const capasImagenesRef = useRef<CapaGis[]>([])
  const layersMapRef = useRef<globalThis.Map<number, Layer>>(new globalThis.Map())
  const navigateDoneRef = useRef(false)
  const { map, setMap, setView, addCapa, clearCapas, setLoading } = useMapContext()
  const [basemapActual, setBasemapActual] = useState<number | null>(null)
  const [capasImagenes, setCapasImagenes] = useState<CapaGis[]>([])
  const [capasVisibles, setCapasVisibles] = useState<CapaGis[]>([])
  const [configMapa, setConfigMapa] = useState<MapaConfig | null>(null)

  const loadBasemapLayer = useCallback(async (capaGis: CapaGis) => {
    let layer = layersMapRef.current.get(capaGis.id_relacion)
    
    if (!layer) {
      const newLayer = createCapaGis(capaGis)
      if (newLayer) {
        layersMapRef.current.set(capaGis.id_relacion, newLayer)
        newLayer.visible = true
        await newLayer.load()
        addCapa(capaGis, newLayer)
      }
    } else {
      layer.visible = true
    }
  }, [addCapa])

  const handleBasemapChange = useCallback(async (capaId: number | null) => {
    const capasActuales = [...capasImagenesRef.current]
    
    for (const capa of capasActuales) {
      const layer = layersMapRef.current.get(capa.id_relacion)
      if (layer) {
        layer.visible = capa.id_relacion === capaId
      }
    }

    if (capaId !== null) {
      const capaSeleccionada = capasActuales.find(c => c.id_relacion === capaId)
      if (capaSeleccionada) {
        await loadBasemapLayer(capaSeleccionada)
      }
    }
    
    setBasemapActual(capaId)
  }, [loadBasemapLayer])

  const goToInitial = useCallback(() => {
    if (!viewRef.current) return
    
    if (configMapa?.configuracion_global?.center && configMapa?.configuracion_global?.zoom) {
      viewRef.current.goTo({
        center: configMapa.configuracion_global.center,
        zoom: configMapa.configuracion_global.zoom,
      })
    } else {
      viewRef.current.extent = new Extent(INITIAL_EXTENT)
    }
  }, [configMapa])

  useEffect(() => {
    if (!mapDivRef.current || mapInitializedRef.current) return

    console.log("[MapCanvas] Iniciando mapa con TileLayer base")

    const baseLayer = new TileLayer({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
      id: "basemap",
      visible: true,
    })

    const newMap = new Map({
      layers: [baseLayer],
    })

    const view = new MapView({
      container: mapDivRef.current!,
      map: newMap,
      constraints: { rotationEnabled: false },
      extent: new Extent(INITIAL_EXTENT),
      spatialReference: { wkid: 32719 },
    })

    view.when()
      .then(() => {
        console.log("[MapCanvas] MapView creado exitosamente")
        mapInitializedRef.current = true
        setMap(newMap)
        setView(view)
      })
      .catch((err) => {
        console.error("[MapCanvas] Error al crear MapView:", err)
        mapInitializedRef.current = true
        setMap(newMap)
        setView(view)
      })

    viewRef.current = view

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
        viewRef.current = null
        mapInitializedRef.current = false
      }
    }
  }, [setMap, setView])

  const loadLayer = useCallback(async (capaGis: CapaGis, mapRef: typeof map) => {
    const layer = createCapaGis(capaGis)
    if (!layer || !mapRef) return

    layersMapRef.current.set(capaGis.id_relacion, layer)
    
    try {
      await layer.load()
      console.log(`[MapCanvas] Capa cargada: "${capaGis.nombre_amigable || capaGis.nombre_tecnico_servicio}"`)
      mapRef.add(layer)
      addCapa(capaGis, layer)
    } catch (err) {
      console.error(`[MapCanvas] Error loading layer ${capaGis.nombre_tecnico_servicio}:`, err)
    }
  }, [addCapa])

  useEffect(() => {
    if (!map || !config) return

    const currentConfig: MapaConfig = config

    console.log("[MapCanvas] Configuración recibida:", currentConfig)
    console.log("[MapCanvas] Capas:", currentConfig.capas)

    setConfigMapa(currentConfig)
    setLoading(true)
    navigateDoneRef.current = false
    clearCapas()
    layersMapRef.current.clear()

    const capasOrdenadas = sortCapasPorOrden(currentConfig.capas)
    const capasNoImagenes = capasOrdenadas.filter(c => c.grupo !== GRUPO_IMAGENES)
    const capasImagenesList = capasOrdenadas.filter(c => c.grupo === GRUPO_IMAGENES)
    
    capasImagenesRef.current = capasImagenesList
    setCapasImagenes(capasImagenesList)
    setCapasVisibles(capasNoImagenes)

    let loadedCount = 0
    const totalCapas = capasNoImagenes.length

    async function loadAllLayers() {
      for (let i = 0; i < capasNoImagenes.length; i += MAX_CONCURRENT_LAYERS) {
        const batch = capasNoImagenes.slice(i, i + MAX_CONCURRENT_LAYERS)
        await Promise.all(batch.map(capa => loadLayer(capa, map)))
        loadedCount += batch.length
        
        if (loadedCount >= totalCapas && !navigateDoneRef.current) {
          navigateDoneRef.current = true
          setLoading(false)
          
          const globalConfig = currentConfig.configuracion_global
          if (globalConfig?.center && globalConfig?.zoom) {
            viewRef.current?.goTo({
              center: globalConfig.center,
              zoom: globalConfig.zoom,
            }).catch(() => {
              viewRef.current!.extent = new Extent(INITIAL_EXTENT)
            })
          } else {
            viewRef.current?.goTo({ extent: new Extent(INITIAL_EXTENT) })
          }
        }
      }
    }

    loadAllLayers()
  }, [map, config, loadLayer, clearCapas, setLoading, addCapa])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapDivRef} className="w-full h-full" />
      
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
        <Button
          variant="outline"
          size="sm"
          onClick={goToInitial}
          className="bg-card shadow-lg"
          title="Ir al inicio"
        >
          <Home className="h-4 w-4" />
        </Button>
        
        {capasImagenes.length > 0 && (
          <BasemapSelector
            capasImagenes={capasImagenes}
            basemapActual={basemapActual}
            onBasemapChange={handleBasemapChange}
          />
        )}
        
        {capasVisibles.length > 0 && (
          <TOCFlotante capas={capasVisibles} />
        )}
      </div>
      
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Cargando capas...</span>
          </div>
        </div>
      )}
    </div>
  )
}
