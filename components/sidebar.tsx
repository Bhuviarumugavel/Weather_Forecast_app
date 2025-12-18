"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar, Upload, Filter, FileSpreadsheet, AlertCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWeather } from "@/lib/weather-context"
import { useRef, useMemo } from "react"
import * as XLSX from "xlsx"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function Sidebar() {
  const { weatherData, setWeatherData, filters, setFilters, availableDates, isLoading, setIsLoading } = useWeather()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const availableStates = useMemo(() => {
    const states = new Set(weatherData.map((row) => row.State))
    return Array.from(states).sort()
  }, [weatherData])

  const availableDistricts = useMemo(() => {
    if (!filters.state) return []
    const districts = new Set(weatherData.filter((row) => row.State === filters.state).map((row) => row.District))
    return Array.from(districts).sort()
  }, [weatherData, filters.state])

  const availableBlocks = useMemo(() => {
    if (!filters.district) return []
    const blocks = new Set(
      weatherData
        .filter((row) => row.State === filters.state && row.District === filters.district)
        .map((row) => row.Block),
    )
    return Array.from(blocks).sort()
  }, [weatherData, filters.state, filters.district])

  const availableVillages = useMemo(() => {
    if (!filters.block) return []
    const villages = new Set(
      weatherData
        .filter(
          (row) => row.State === filters.state && row.District === filters.district && row.Block === filters.block,
        )
        .map((row) => row.Village),
    )
    return Array.from(villages).sort()
  }, [weatherData, filters.state, filters.district, filters.block])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: "array" })

      const allData: typeof weatherData = []

      // Parse all sheets
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        // Validate sheet name format (YYYYMMDD)
        const dateMatch = sheetName.match(/^\d{8}$/)
        const forecastDate = dateMatch ? sheetName : new Date().toISOString().slice(0, 10).replace(/-/g, "")

        jsonData.forEach((row) => {
          if (row.State && row.District && row.Block && row.Village && row.Latitude != null && row.Longitude != null) {
            allData.push({
              State: String(row.State),
              District: String(row.District),
              Block: String(row.Block),
              Village: String(row.Village),
              Latitude: Number(row.Latitude),
              Longitude: Number(row.Longitude),
              Rain: Number(row.Rain || 0),
              Tmax: Number(row.Tmax || 0),
              Tmin: Number(row.Tmin || 0),
              RH: Number(row.RH || 0),
              Wind_Speed: Number(row.Wind_Speed || 0),
              ForecastDate: forecastDate,
            })
          }
        })
      })

      setWeatherData(allData)

      // Set first available date as default
      if (allData.length > 0 && !filters.forecastDate) {
        const dates = Array.from(new Set(allData.map((row) => row.ForecastDate))).sort()
        setFilters({ ...filters, forecastDate: dates[0] })
      }
    } catch (error) {
      console.error("Error parsing Excel file:", error)
      alert("Error parsing Excel file. Please check the format.")
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleStateChange = (value: string) => {
    setFilters({ ...filters, state: value, district: "", block: "", village: "" })
  }

  const handleDistrictChange = (value: string) => {
    setFilters({ ...filters, district: value, block: "", village: "" })
  }

  const handleBlockChange = (value: string) => {
    setFilters({ ...filters, block: value, village: "" })
  }

  const handleVillageChange = (value: string) => {
    setFilters({ ...filters, village: value })
  }

  const handleDateChange = (value: string) => {
    setFilters({ ...filters, forecastDate: value })
  }

  const clearFilters = () => {
    setFilters({ state: "", district: "", block: "", village: "", forecastDate: filters.forecastDate })
  }

  return (
    <div className="space-y-4">
      {/* Upload Data Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5 text-primary" />
            Upload Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isLoading}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-8 w-8 mx-auto text-primary mb-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            )}
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Processing..." : "Click to upload Excel file"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">.xlsx format</p>
          </button>

          {weatherData.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Loaded {weatherData.length} records from {availableDates.length} forecast date(s)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Forecast Date Selector */}
      {availableDates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Forecast Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filters.forecastDate} onValueChange={handleDateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select forecast date" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => (
                  <SelectItem key={date} value={date}>
                    {date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Filters Card */}
      {weatherData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-primary" />
              Location Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* State Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">State</Label>
              <Select value={filters.state} onValueChange={handleStateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allStates">All States</SelectItem>
                  {availableStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">District</Label>
              <Select value={filters.district} onValueChange={handleDistrictChange} disabled={!filters.state}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allDistricts">All Districts</SelectItem>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Block Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Block</Label>
              <Select value={filters.block} onValueChange={handleBlockChange} disabled={!filters.district}>
                <SelectTrigger>
                  <SelectValue placeholder="Select block" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allBlocks">All Blocks</SelectItem>
                  {availableBlocks.map((block) => (
                    <SelectItem key={block} value={block}>
                      {block}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Village Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Village</Label>
              <Select value={filters.village} onValueChange={handleVillageChange} disabled={!filters.block}>
                <SelectTrigger>
                  <SelectValue placeholder="Select village" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allVillages">All Villages</SelectItem>
                  {availableVillages.map((village) => (
                    <SelectItem key={village} value={village}>
                      {village}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-transparent" variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
