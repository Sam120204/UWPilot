import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <a href="#top" className="text-3xl md:text-4xl font-bold text-purple-700 hover:text-purple-600 transition-colors">UWPilot</a>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            <li><a href="#features" className="text-gray-600 hover:text-purple-700 font-medium">Features</a></li>
            <li><a href="#export" className="text-gray-600 hover:text-purple-700 font-medium">Export Schedule</a></li>
            <li><a href="#team" className="text-gray-600 hover:text-purple-700 font-medium">Team</a></li>
            <li>
              <Button asChild className="bg-purple-600 hover:bg-purple-700 rounded-full text-white">
                <a href="#download" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download UWPilot
                </a>
              </Button>
            </li>
          </ul>
        </nav>
        <Button className="md:hidden" variant="ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
    </header>
  )
}

