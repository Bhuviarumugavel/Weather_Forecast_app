import { Cloud, Sprout } from "lucide-react"

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="max-w-[1600px] mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 md:h-10 md:w-10" />
            <Cloud className="h-6 w-6 md:h-8 md:w-8" />
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-tight">Weather Forecast Portal</h1>
            <p className="text-xs md:text-base text-primary-foreground/90 mt-1">
              National Agro Foundation, Chennai | Climate Lab Division
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
