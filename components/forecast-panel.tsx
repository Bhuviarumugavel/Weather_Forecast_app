"use client";

import {
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  AlertCircle,
  MapPin,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWeather } from "@/lib/weather-context";
import { useMemo } from "react";

/* ---------- Safe date helpers ---------- */
function parseDateSafe(value: string): Date | null {
  if (!value) return null;

  // YYYYMMDD
  if (/^\d{8}$/.test(value)) {
    return new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`);
  }

  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDateSafe(value: string) {
  const d = parseDateSafe(value);
  return d
    ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : value;
}

export function ForecastPanel() {
  const { filteredData, filters, selectedRow, weatherData } = useWeather();

  /* ---------- TRUE 5-DAY FORECAST (unique dates) ---------- */
  const fiveDayForecast = useMemo(() => {
    if (!selectedRow) return [];

    const byDate = new Map<string, typeof selectedRow>();

    for (const row of weatherData) {
      if (
        row.State === selectedRow.State &&
        row.District === selectedRow.District &&
        row.Block === selectedRow.Block &&
        row.Village === selectedRow.Village &&
        !byDate.has(row.ForecastDate)
      ) {
        byDate.set(row.ForecastDate, row);
      }
    }

    return Array.from(byDate.values())
      .sort((a, b) => a.ForecastDate.localeCompare(b.ForecastDate))
      .slice(0, 5);
  }, [selectedRow, weatherData]);

  /* ---------- Numeric stats (NO strings) ---------- */
  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const avg = (k: keyof typeof filteredData[0]) =>
      filteredData.reduce((s, d) => s + (d[k] as number), 0) / filteredData.length;

    return {
      avgRain: avg("Rain"),
      avgTmax: avg("Tmax"),
      avgTmin: avg("Tmin"),
      avgRH: avg("RH"),
      avgWind: avg("Wind_Speed"),
      maxRain: Math.max(...filteredData.map((d) => d.Rain)),
      minTemp: Math.min(...filteredData.map((d) => d.Tmin)),
      maxTemp: Math.max(...filteredData.map((d) => d.Tmax)),
      count: filteredData.length,
    };
  }, [filteredData]);

  const displayData = selectedRow ?? null;

  const locationName =
    displayData
      ? `${displayData.Village}, ${displayData.Block}`
      : filters.village ||
        filters.block ||
        filters.district ||
        filters.state ||
        "Selected Region";

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Forecast Details</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm font-medium">No Data Available</p>
          <p className="text-xs text-muted-foreground mt-2">
            Upload weather data to view forecast details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* LOCATION */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {displayData ? "Location Details" : "Forecast Summary"}
          </CardTitle>
          <p className="text-sm font-medium">{locationName}</p>
        </CardHeader>
      </Card>

      {/* 5-DAY FORECAST */}
      {displayData && fiveDayForecast.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              5-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {fiveDayForecast.map((f, i) => (
              <div key={f.ForecastDate} className="border rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <p className="font-semibold text-sm">
                    {formatDateSafe(f.ForecastDate)}
                  </p>
                  <Badge variant={i === 0 ? "default" : "secondary"}>
                    {i === 0 ? "Today" : `Day ${i + 1}`}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><CloudRain className="inline h-4 w-4 mr-1" />{f.Rain.toFixed(1)} mm</div>
                  <div><Thermometer className="inline h-4 w-4 mr-1" />{f.Tmin.toFixed(1)}–{f.Tmax.toFixed(1)}°C</div>
                  <div><Droplets className="inline h-4 w-4 mr-1" />{f.RH.toFixed(1)}%</div>
                  <div><Wind className="inline h-4 w-4 mr-1" />{f.Wind_Speed.toFixed(1)} km/h</div>
                </div>

                {f.Rain > 50 && (
                  <Alert className="mt-3 py-2">
                    <AlertCircle className="h-3 w-3" />
                    <AlertDescription className="text-xs">
                      Heavy rainfall expected
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ALERT */}
      {(displayData?.Rain ?? stats.maxRain) > 50 && (
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Heavy rainfall expected in the selected area
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
