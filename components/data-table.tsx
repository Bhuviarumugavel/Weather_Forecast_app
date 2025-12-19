"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeather, type WeatherDataRow } from "@/lib/weather-context";
import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type SortColumn = keyof WeatherDataRow | null;
type SortDirection = "asc" | "desc";

export function DataTable() {
  const { filteredData, selectedRow, setSelectedRow, isLoading } = useWeather();

  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (column: keyof WeatherDataRow) => {
    if (sortColumn === column) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // ✅ PERFORMANCE FIX
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortColumn, sortDirection]);

  const SortIcon = ({ column }: { column: keyof WeatherDataRow }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 ml-1 text-muted-foreground" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 ml-1 text-primary" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 ml-1 text-primary" />
    );
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Weather Forecast Data</CardTitle>
          <p className="text-xs text-muted-foreground">
            {sortedData.length} record(s)
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Loading data…</p>
            </div>
          ) : sortedData.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-sm font-medium">No Data Available</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload an Excel file or adjust filters
                </p>
              </div>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0 z-10">
                  <tr className="border-b">
                    {[
                      "ForecastDate",
                      "State",
                      "District",
                      "Block",
                      "Village",
                      "Rain",
                      "Tmax",
                      "Tmin",
                      "RH",
                      "Wind_Speed",
                    ].map((col) => (
                      <th
                        key={col}
                        className={`p-3 whitespace-nowrap ${
                          ["Rain", "Tmax", "Tmin", "RH", "Wind_Speed"].includes(col)
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent font-semibold"
                          onClick={() => handleSort(col as keyof WeatherDataRow)}
                        >
                          {col.replace("_", " ")}
                          <SortIcon column={col as keyof WeatherDataRow} />
                        </Button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {sortedData.map((row, idx) => {
                    // ✅ STABLE SELECTION LOGIC
                    const isSelected =
                      selectedRow?.ForecastDate === row.ForecastDate &&
                      selectedRow?.Village === row.Village &&
                      selectedRow?.Block === row.Block &&
                      selectedRow?.District === row.District;

                    return (
                      <tr
                        key={`${row.Village}-${row.ForecastDate}-${idx}`}
                        onClick={() => setSelectedRow(row)}
                        className={`border-b cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-primary/10 hover:bg-primary/15"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <td className="p-3 font-mono text-xs">{row.ForecastDate}</td>
                        <td className="p-3">{row.State}</td>
                        <td className="p-3">{row.District}</td>
                        <td className="p-3">{row.Block}</td>
                        <td className="p-3 font-medium">{row.Village}</td>
                        <td className="p-3 text-right font-mono">{row.Rain.toFixed(1)}</td>
                        <td className="p-3 text-right font-mono">{row.Tmax.toFixed(1)}</td>
                        <td className="p-3 text-right font-mono">{row.Tmin.toFixed(1)}</td>
                        <td className="p-3 text-right font-mono">{row.RH.toFixed(1)}</td>
                        <td className="p-3 text-right font-mono">{row.Wind_Speed.toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
