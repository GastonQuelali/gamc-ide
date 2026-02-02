import { useEffect, useRef } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import LayerList from "@arcgis/core/widgets/LayerList";

export default function BaseMapView() {
    const mapDiv = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapDiv.current) return;

        const map = new Map({
            basemap: "streets-navigation-vector",
        });

        const view = new MapView({
            container: mapDiv.current,
            map,
            center: [-63.18, -17.78],
            zoom: 12,
        });

        const layerList = new LayerList({
            view,
        });

        view.ui.add(layerList, "top-right");

        return () => {
            view.destroy();
        };
    }, []);

    return <div ref={mapDiv} style={{ height: "100vh" }} />;
}
