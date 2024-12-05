import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, ComputerIcon as Windows, CheckCircle } from 'lucide-react'

export function DownloadSection() {
  return (
    <section id="download" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Download UWPilot</h2>
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="bg-purple-700 text-white">
            <CardTitle className="flex items-center justify-center text-2xl">
              <Windows className="mr-2" /> Windows Desktop Version
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <p className="text-xl mb-4">Current Version: 4.0.0</p>
              <Button size="lg" asChild className="gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105">
                <a href="https://drive.google.com/file/d/1-x2wHhX1PuhgYOR2w-twpEkWvjxgXdU_/view?usp=sharing" target="_blank" rel="noopener noreferrer">
                  <Download className="w-6 h-6" /> Download UWPilot
                </a>
              </Button>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h3 className="font-semibold text-xl mb-4 text-purple-700">Installation Instructions:</h3>
              <ol className="space-y-4">
                {[
                  "Download the UWPilot installer (UWPilot-4.0.0.msi) using the button above.",
                  "Double-click the installer and follow the prompts to complete the installation.",
                  "The application will automatically be installed in C:\\Users\\[Your Computer Username]\\AppData\\Local\\UWPilot",
                  "Once installed, you can open UWPilot from the Start menu or desktop shortcut (if created during installation)."
                ].map((step, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

