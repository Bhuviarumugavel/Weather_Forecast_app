export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-foreground">About This Portal</h3>
            <p className="text-muted-foreground leading-relaxed">
              Official weather forecasting portal by the Climate Lab Division of National Agro Foundation, providing
              agricultural weather data and forecasts for informed decision-making.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Quick Links</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Data Disclaimer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Credits</h3>
            <p className="text-muted-foreground leading-relaxed">
              © 2025 National Agro Foundation, Chennai
              <br />
              Climate Lab Division
              <br />
              Developed with Next.js and TypeScript
            </p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          Last updated:{" "}
          {new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </div>
      </div>
    </footer>
  )
}
