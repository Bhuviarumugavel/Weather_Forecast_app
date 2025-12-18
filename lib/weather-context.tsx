"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type WeatherDataRow = {
  State: string
  District: string
  Block: string
  Village: string
  Latitude: number
  Longitude: number
  Rain: number
  Tmax: number
  Tmin: number
  RH: number
  Wind_Speed: number
  ForecastDate: string
}

export type WeatherFilters = {
  state: string
  district: string
  block: string
  village: string
  forecastDate: string
}

type WeatherContextType = {
  weatherData: WeatherDataRow[]
  setWeatherData: (data: WeatherDataRow[]) => void
  filters: WeatherFilters
  setFilters: (filters: WeatherFilters) => void
  filteredData: WeatherDataRow[]
  availableDates: string[]
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  selectedRow: WeatherDataRow | null
  setSelectedRow: (row: WeatherDataRow | null) => void
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weatherData, setWeatherData] = useState<WeatherDataRow[]>([])
  const [filters, setFilters] = useState<WeatherFilters>({
    state: "",
    district: "",
    block: "",
    village: "",
    forecastDate: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState<WeatherDataRow | null>(null)

  // Get available forecast dates from data
  const availableDates = Array.from(new Set(weatherData.map((row) => row.ForecastDate))).sort()

  // Filter data based on current filters
  const filteredData = weatherData.filter((row) => {
    if (filters.forecastDate && row.ForecastDate !== filters.forecastDate) return false
    if (filters.state && row.State !== filters.state) return false
    if (filters.district && row.District !== filters.district) return false
    if (filters.block && row.Block !== filters.block) return false
    if (filters.village && row.Village !== filters.village) return false
    return true
  })

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        setWeatherData,
        filters,
        setFilters,
        filteredData,
        availableDates,
        isLoading,
        setIsLoading,
        selectedRow,
        setSelectedRow,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeather() {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider")
  }
  return context
}
