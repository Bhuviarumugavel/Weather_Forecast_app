import { Header } from "@/components/header"
import { Navigation } from "@/components/navigation"
import { Sidebar } from "@/components/sidebar"
import { MapSection } from "@/components/map-section"
import { ForecastPanel } from "@/components/forecast-panel"
import { Footer } from "@/components/footer"
import { WeatherProvider } from "@/lib/weather-context"

export default function Home() {
  return (
    <WeatherProvider>
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
    </WeatherProvider>
  )
}
