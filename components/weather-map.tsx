"use client";

import { useWeather, type WeatherDataRow } from "@/lib/weather-context";
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ✅ FIX: Leaflet default icon issue (Next.js) */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* 🎯 Custom rainfall marker */
const createCustomIcon = (rainfall: number, isSelected: boolean) => {
  let color = "#3b82f6";
  if (rainfall > 0 && rainfall <= 10) color = "#eab308";
  else if (rainfall > 10 && rainfall <= 50) color = "#f97316";
  else if (rainfall > 50) color = "#1d4ed8";

  const size = isSelected ? 32 : 24;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width:${size}px;height:${size}px;
        background:${color};
        border:${isSelected ? 4 : 3}px solid white;
        border-radius:50%;
        box-shadow:0 2px 8px rgba(0,0,0,.3);
        position:relative">
        <div style="
          width:${size / 2}px;height:${size / 2}px;
          background:white;border-radius:50%;
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%)">
        </div>
      </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

/* ✅ Typed bounds updater */
function MapBoundsUpdater({ locations }: { locations: WeatherDataRow[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    const valid = locations.filter(
      (l) =>
        Number.isFinite(l.Latitude) && Number.isFinite(l.Longitude)
    );

    if (valid.length > 0) {
      const bounds = L.latLngBounds(
        valid.map((l) => [l.Latitude, l.Longitude])
      );
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }, [locations, map]);

  return null;
}

export default function WeatherMap() {
  const { filteredData, selectedRow, setSelectedRow } = useWeather();

  /* ✅ Safe center calculation */
  const center = useMemo(() => {
    const valid = filteredData.filter(
      (l) =>
        Number.isFinite(l.Latitude) && Number.isFinite(l.Longitude)
    );
    if (valid.length === 0) return [20.5937, 78.9629]; // India center

    return [
      valid.reduce((s, l) => s + l.Latitude, 0) / valid.length,
      valid.reduce((s, l) => s + l.Longitude, 0) / valid.length,
    ] as [number, number];
  }, [filteredData]);

  if (filteredData.length === 0) {
    return (
      <div className="relative bg-muted aspect-video md:aspect-[16/10] lg:h-[calc(100vh-280px)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium">No Data Available</p>
          <p className="text-xs text-muted-foreground mt-1">
            Upload an Excel file to visualize weather data
          </p>
        </div>
        <RainfallLegend />
      </div>
    );
  }

  return (
    <div className="relative aspect-video md:aspect-[16/10] lg:h-[calc(100vh-280px)]">
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsUpdater locations={filteredData} />

        {filteredData.map((loc, idx) => {
          const isSelected =
            selectedRow &&
            selectedRow.Village === loc.Village &&
            selectedRow.Block === loc.Block &&
            selectedRow.District === loc.District &&
            selectedRow.ForecastDate === loc.ForecastDate;

          return (
            <Marker
              key={`${loc.Village}-${loc.ForecastDate}-${idx}`}
              position={[loc.Latitude, loc.Longitude]}
              icon={createCustomIcon(loc.Rain, isSelected)}
              eventHandlers={{ click: () => setSelectedRow(loc) }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <strong>{loc.Village}</strong>
                  <div>{loc.Block}, {loc.District}</div>
                  <div>Rain: {loc.Rain.toFixed(1)} mm</div>
                  <div>
                    Temp: {loc.Tmin.toFixed(1)}–{loc.Tmax.toFixed(1)} °C
                  </div>
                  <div>RH: {loc.RH.toFixed(1)}%</div>
                  <div>Wind: {loc.Wind_Speed.toFixed(1)} km/h</div>
                  <div className="text-[10px] text-muted-foreground">
                    {loc.ForecastDate}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <RainfallLegend />
    </div>
  );
}

function RainfallLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-background/95 p-3 rounded-lg shadow border z-10 text-xs">
      <div className="font-semibold mb-2">Rainfall Intensity</div>
      <div className="space-y-1">
        <LegendItem color="#3b82f6" label="No Rain (0 mm)" />
        <LegendItem color="#eab308" label="Light (1–10 mm)" />
        <LegendItem color="#f97316" label="Moderate (11–50 mm)" />
        <LegendItem color="#1d4ed8" label="Heavy (>50 mm)" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-full border-2 border-white"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </div>
  );
}
