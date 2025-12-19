
"use client";

import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { Sidebar } from "@/components/sidebar";
import { MapSection } from "@/components/map-section";
import { ForecastPanel } from "@/components/forecast-panel";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation />

      <div className="flex flex-1 flex-col lg:flex-row gap-4 p-4 max-w-[1600px] mx-auto w-full">
        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 xl:w-80 shrink-0">
          <Sidebar />
        </aside>

        {/* Main Map Section */}
        <main className="flex-1 min-w-0">
          <MapSection />
        </main>

        {/* Right Forecast Panel */}
        <aside className="w-full lg:w-80 xl:w-96 shrink-0">
          <ForecastPanel />
        </aside>
      </div>

      <Footer />
    </div>
  );
}

_______________________________________________________

4.components
4.1 components/map-section.tsx

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
