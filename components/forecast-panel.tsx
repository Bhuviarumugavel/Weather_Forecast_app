"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, Wind, Droplets, Thermometer, AlertCircle, MapPin, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useWeather } from "@/lib/weather-context"
import { useMemo } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ForecastPanel() {
  const { filteredData, filters, selectedRow, weatherData } = useWeather()

  const fiveDayForecast = useMemo(() => {
    if (!selectedRow) return []

    // Get all forecast dates for this village
    const villageForecast = weatherData
      .filter(
        (row) =>
          row.Village === selectedRow.Village &&
          row.Block === selectedRow.Block &&
          row.District === selectedRow.District &&
          row.State === selectedRow.State,
      )
      .sort((a, b) => a.ForecastDate.localeCompare(b.ForecastDate))

    return villageForecast.slice(0, 5)
  }, [selectedRow, weatherData])

  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return null
    }

    const avgRain = filteredData.reduce((sum, d) => sum + d.Rain, 0) / filteredData.length
    const avgTmax = filteredData.reduce((sum, d) => sum + d.Tmax, 0) / filteredData.length
    const avgTmin = filteredData.reduce((sum, d) => sum + d.Tmin, 0) / filteredData.length
    const avgRH = filteredData.reduce((sum, d) => sum + d.RH, 0) / filteredData.length
    const avgWindSpeed = filteredData.reduce((sum, d) => sum + d.Wind_Speed, 0) / filteredData.length

    const maxRain = Math.max(...filteredData.map((d) => d.Rain))
    const minTemp = Math.min(...filteredData.map((d) => d.Tmin))
    const maxTemp = Math.max(...filteredData.map((d) => d.Tmax))

    return {
      avgRain: avgRain.toFixed(1),
      avgTmax: avgTmax.toFixed(1),
      avgTmin: avgTmin.toFixed(1),
      avgRH: avgRH.toFixed(1),
      avgWindSpeed: avgWindSpeed.toFixed(1),
      maxRain: maxRain.toFixed(1),
      minTemp: minTemp.toFixed(1),
      maxTemp: maxTemp.toFixed(1),
      count: filteredData.length,
    }
  }, [filteredData])

  const formatDate = (dateStr: string) => {
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(4, 6)
    const day = dateStr.slice(6, 8)
    const date = new Date(`${year}-${month}-${day}`)
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  }

  const displayData = selectedRow || null
  const locationName = displayData
    ? `${displayData.Village}, ${displayData.Block}`
    : filters.village || filters.block || filters.district || filters.state || "Selected Region"

  return (
    <div className="space-y-4">
      {stats ? (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {displayData ? "Location Details" : "Forecast Summary"}
              </CardTitle>
              <p className="text-sm font-medium text-foreground">{locationName}</p>
              {displayData && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {displayData.State} → {displayData.District}
                  </span>
                </div>
              )}
              {displayData && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {displayData.Latitude.toFixed(4)}° N, {displayData.Longitude.toFixed(4)}° E
                  </span>
                </div>
              )}
            </CardHeader>
          </Card>

          {displayData && fiveDayForecast.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  5-Day Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {fiveDayForecast.map((forecast, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-sm">{formatDate(forecast.ForecastDate)}</p>
                          <p className="text-xs text-muted-foreground">{forecast.ForecastDate}</p>
                        </div>
                        <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                          {index === 0 ? "Today" : `Day ${index + 1}`}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 bg-primary/10 rounded-lg p-3 border border-primary/20">
                          <div className="flex items-center gap-2 mb-1">
                            <CloudRain className="h-4 w-4 text-primary" />
                            <p className="text-xs font-medium text-muted-foreground">Rainfall</p>
                          </div>
                          <p className="text-2xl font-bold text-primary">{forecast.Rain.toFixed(1)} mm</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-destructive" />
                          <div>
                            <p className="text-xs text-muted-foreground">Max Temp</p>
                            <p className="text-sm font-semibold">{forecast.Tmax.toFixed(1)}°C</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Min Temp</p>
                            <p className="text-sm font-semibold">{forecast.Tmin.toFixed(1)}°C</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Humidity</p>
                            <p className="text-sm font-semibold">{forecast.RH.toFixed(1)}%</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground">Wind Speed</p>
                            <p className="text-sm font-semibold">{forecast.Wind_Speed.toFixed(1)} km/h</p>
                          </div>
                        </div>
                      </div>

                      {forecast.Rain > 50 && (
                        <Alert className="mt-3 py-2">
                          <AlertCircle className="h-3 w-3" />
                          <AlertDescription className="text-xs">Heavy rainfall expected</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ) : displayData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-primary">{displayData.Tmax.toFixed(1)}°C</div>
                  <p className="text-muted-foreground mt-2">Maximum Temperature</p>
                  <Badge variant="secondary" className="mt-2">
                    Min: {displayData.Tmin.toFixed(1)}°C
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Wind Speed</p>
                      <p className="text-sm font-medium">{displayData.Wind_Speed.toFixed(1)} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p className="text-sm font-medium">{displayData.RH.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Min Temp</p>
                      <p className="text-sm font-medium">{displayData.Tmin.toFixed(1)}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rainfall</p>
                      <p className="text-sm font-medium">{displayData.Rain.toFixed(1)} mm</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Forecast for {formatDate(displayData.ForecastDate)}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regional Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-5xl font-bold text-primary">{stats.avgTmax}°C</div>
                  <p className="text-muted-foreground mt-2">Average Maximum Temperature</p>
                  <Badge variant="secondary" className="mt-2">
                    Min: {stats.minTemp}°C | Max: {stats.maxTemp}°C
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Wind Speed</p>
                      <p className="text-sm font-medium">{stats.avgWindSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                      <p className="text-sm font-medium">{stats.avgRH}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Min Temp</p>
                      <p className="text-sm font-medium">{stats.avgTmin}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rainfall</p>
                      <p className="text-sm font-medium">{stats.avgRain} mm</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Statistics from {stats.count} location(s)
                    {filters.forecastDate && <> for {formatDate(filters.forecastDate)}</>}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {((displayData && displayData.Rain > 50) || (!displayData && Number.parseFloat(stats.maxRain) > 50)) && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-lg text-destructive flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Weather Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="destructive" className="shrink-0">
                      Alert
                    </Badge>
                    <p className="text-sm">
                      Heavy rainfall expected (
                      {displayData ? `${displayData.Rain.toFixed(1)} mm` : `up to ${stats.maxRain} mm`}){" "}
                      {displayData ? "at this location" : "in some areas"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Forecast Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-foreground">No Data Available</p>
              <p className="text-xs text-muted-foreground mt-2">Upload weather data to view forecast details</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
