"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Layers } from "lucide-react";
import { useWeather } from "@/lib/weather-context";
import { DataTable } from "./data-table";
import { Skeleton } from "@/components/ui/skeleton";

const WeatherMap = dynamic(() => import("./weather-map"), {
  ssr: false,
  loading: () => (
    <div className="relative bg-muted aspect-video md:aspect-[16/10] lg:aspect-auto lg:h-[calc(100vh-280px)]">
      <Skeleton className="w-full h-full" />
    </div>
  ),
});

export function MapSection() {
  const { filteredData, isLoading } = useWeather();

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Interactive Weather Map</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {filteredData.length} location(s) displayed
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Layers className="h-4 w-4 mr-2" />
                Layers
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="relative bg-muted aspect-video md:aspect-[16/10] lg:aspect-auto lg:h-[calc(100vh-280px)] flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Loading weather data…
                </p>
              </div>
            </div>
          ) : (
            <WeatherMap />
          )}
        </CardContent>
      </Card>

      {/* ✅ Table rendered only when data exists */}
      {filteredData.length > 0 && <DataTable />}
    </>
  );
}
