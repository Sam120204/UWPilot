import { Button } from "@/components/ui/button"
import { Calendar, Download } from 'lucide-react'

interface HeroSectionProps {
  id?: string;
}

export function HeroSection({ id }: HeroSectionProps) {
  return (
    <section id={id} className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-32 md:py-48">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">Welcome to UWPilot</h1>
        <p className="text-xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed">
          Your ultimate course planning tool for University of Waterloo students
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Button 
            size="lg" 
            className="bg-white text-purple-700 hover:bg-gray-100 rounded-full min-w-[220px] text-lg h-14"
            asChild
          >
            <a href="#download" className="flex items-center justify-center gap-2">
              <Download className="w-6 h-6" />
              Download UWPilot
            </a>
          </Button>
          <Button 
            size="lg" 
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full min-w-[220px] text-lg h-14"
            asChild
          >
            <a href="#export" className="flex items-center justify-center gap-2">
              <Calendar className="w-6 h-6" />
              Export Schedule
            </a>
          </Button>
        </div>
        <div className="mt-16">
          <a href="#features" className="text-white hover:text-gray-200 flex flex-col items-center">
            <span className="mb-2">Discover More</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

