"use client"
import { useWeather } from "@/lib/weather-context"
import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const createCustomIcon = (rainfall: number, isSelected: boolean) => {
  let color = "#3b82f6" // blue - no rain
  if (rainfall > 0 && rainfall <= 10)
    color = "#eab308" // yellow - light rain
  else if (rainfall > 10 && rainfall <= 50)
    color = "#f97316" // orange - moderate rain
  else if (rainfall > 50) color = "#1d4ed8" // dark blue - heavy rain

  const size = isSelected ? 32 : 24

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: ${isSelected ? "4px" : "3px"} solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          width: ${size / 2}px;
          height: ${size / 2}px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function MapBoundsUpdater({ locations }: { locations: any[] }) {
  const map = useMap()

  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.Latitude, loc.Longitude]))
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 })
    }
  }, [locations, map])

  return null
}

export default function WeatherMap() {
  const { filteredData, selectedRow, setSelectedRow } = useWeather()
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    setMapKey((prev) => prev + 1)
  }, [filteredData.length])

  if (filteredData.length === 0) {
    return (
      <div className="relative bg-muted aspect-video md:aspect-[16/10] lg:aspect-auto lg:h-[calc(100vh-280px)]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 p-6">
            <MapIcon className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">No Data Available</p>
              <p className="text-xs text-muted-foreground mt-1">Upload an Excel file to visualize weather data</p>
            </div>
          </div>
        </div>
        <RainfallLegend />
      </div>
    )
  }

  const centerLat = filteredData.reduce((sum, loc) => sum + loc.Latitude, 0) / filteredData.length
  const centerLng = filteredData.reduce((sum, loc) => sum + loc.Longitude, 0) / filteredData.length

  return (
    <div className="relative aspect-video md:aspect-[16/10] lg:aspect-auto lg:h-[calc(100vh-280px)]">
      <MapContainer
        key={mapKey}
        center={[centerLat, centerLng]}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsUpdater locations={filteredData} />

        {filteredData.map((location, index) => {
          const isSelected =
            selectedRow &&
            selectedRow.Village === location.Village &&
            selectedRow.Block === location.Block &&
            selectedRow.District === location.District &&
            selectedRow.ForecastDate === location.ForecastDate

          return (
            <Marker
              key={`${location.Village}-${location.Block}-${location.District}-${location.ForecastDate}-${index}`}
              position={[location.Latitude, location.Longitude]}
              icon={createCustomIcon(location.Rain, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedRow(location)
                },
              }}
            >
              <Popup>
                <div className="text-xs space-y-2 min-w-[200px]">
                  <div className="font-semibold text-sm border-b pb-1">{location.Village}</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <span className="text-muted-foreground">Block:</span>
                    <span className="font-medium">{location.Block}</span>
                    <span className="text-muted-foreground">District:</span>
                    <span className="font-medium">{location.District}</span>
                    <span className="text-muted-foreground">State:</span>
                    <span className="font-medium">{location.State}</span>
                  </div>
                  <div className="border-t pt-2 space-y-1">
                    <div className="flex justify-between items-center bg-blue-50 px-2 py-1 rounded">
                      <span className="text-muted-foreground">Rainfall:</span>
                      <span className="font-semibold text-blue-700">{location.Rain} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temp:</span>
                      <span className="font-medium">
                        {location.Tmin}° - {location.Tmax}°C
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Humidity:</span>
                      <span className="font-medium">{location.RH}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wind:</span>
                      <span className="font-medium">{location.Wind_Speed} km/h</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground pt-1 border-t">Date: {location.ForecastDate}</div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <RainfallLegend />
    </div>
  )
}

function RainfallLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border z-10">
      <div className="text-xs font-semibold mb-2">Rainfall Intensity</div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#3b82f6] border-2 border-white shadow-sm" />
          <span className="text-xs">No Rain (0 mm)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#eab308] border-2 border-white shadow-sm" />
          <span className="text-xs">Light (1-10 mm)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#f97316] border-2 border-white shadow-sm" />
          <span className="text-xs">Moderate (11-50 mm)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#1d4ed8] border-2 border-white shadow-sm" />
          <span className="text-xs">Heavy (&gt;50 mm)</span>
        </div>
      </div>
    </div>
  )
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  )
}
