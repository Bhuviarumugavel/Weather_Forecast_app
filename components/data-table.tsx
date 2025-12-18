"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeather, type WeatherDataRow } from "@/lib/weather-context"
import { useState } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type SortColumn = keyof WeatherDataRow | null
type SortDirection = "asc" | "desc"

export function DataTable() {
  const { filteredData, selectedRow, setSelectedRow, isLoading } = useWeather()
  const [sortColumn, setSortColumn] = useState<SortColumn>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (column: keyof WeatherDataRow) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0

    const aVal = a[sortColumn]
    const bVal = b[sortColumn]

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal
    }

    const aStr = String(aVal)
    const bStr = String(bVal)
    return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  const handleRowClick = (row: WeatherDataRow) => {
    setSelectedRow(row)
  }

  const SortIcon = ({ column }: { column: keyof WeatherDataRow }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 ml-1 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 ml-1 text-primary" />
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Weather Forecast Data</CardTitle>
          <p className="text-xs text-muted-foreground">{sortedData.length} record(s)</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading data...</p>
              </div>
            </div>
          ) : sortedData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">No Data Available</p>
                <p className="text-xs text-muted-foreground mt-1">Upload an Excel file or adjust filters</p>
              </div>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0 z-10">
                  <tr className="border-b">
                    <th className="text-left font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("ForecastDate")}
                      >
                        Forecast Date
                        <SortIcon column="ForecastDate" />
                      </Button>
                    </th>
                    <th className="text-left font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("State")}
                      >
                        State
                        <SortIcon column="State" />
                      </Button>
                    </th>
                    <th className="text-left font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("District")}
                      >
                        District
                        <SortIcon column="District" />
                      </Button>
                    </th>
                    <th className="text-left font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("Block")}
                      >
                        Block
                        <SortIcon column="Block" />
                      </Button>
                    </th>
                    <th className="text-left font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("Village")}
                      >
                        Village
                        <SortIcon column="Village" />
                      </Button>
                    </th>
                    <th className="text-right font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("Rain")}
                      >
                        Rain (mm)
                        <SortIcon column="Rain" />
                      </Button>
                    </th>
                    <th className="text-right font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("Tmax")}
                      >
                        Max Temp (°C)
                        <SortIcon column="Tmax" />
                      </Button>
                    </th>
                    <th className="text-right font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("Tmin")}
                      >
                        Min Temp (°C)
                        <SortIcon column="Tmin" />
                      </Button>
                    </th>
                    <th className="text-right font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("RH")}
                      >
                        RH (%)
                        <SortIcon column="RH" />
                      </Button>
                    </th>
                    <th className="text-right font-semibold p-3 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent font-semibold"
                        onClick={() => handleSort("Wind_Speed")}
                      >
                        Wind Speed (km/h)
                        <SortIcon column="Wind_Speed" />
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row, idx) => {
                    const isSelected = selectedRow === row
                    return (
                      <tr
                        key={idx}
                        onClick={() => handleRowClick(row)}
                        className={`border-b cursor-pointer transition-colors ${
                          isSelected ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-muted/50"
                        }`}
                      >
                        <td className="p-3 whitespace-nowrap font-mono text-xs">{row.ForecastDate}</td>
                        <td className="p-3 whitespace-nowrap">{row.State}</td>
                        <td className="p-3 whitespace-nowrap">{row.District}</td>
                        <td className="p-3 whitespace-nowrap">{row.Block}</td>
                        <td className="p-3 whitespace-nowrap font-medium">{row.Village}</td>
                        <td className="p-3 text-right font-mono">{row.Rain.toFixed(1)}</td>
                        <td className="p-3 text-right font-mono">{row.Tmax.toFixed(1)}</td>
                        <td className="p-3 text-right font-mono">{row.Tmin.toFixed(1)}</td>
                        <td className="p-3 text-right font-mono">{row.RH.toFixed(1)}</td>
                        <td className="p-3 text-right font-mono">{row.Wind_Speed.toFixed(1)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
