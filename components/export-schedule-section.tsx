"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {AlertCircle, Calendar, CheckCircle, Info} from 'lucide-react'

export function ExportScheduleSection() {
  const [scheduleData, setScheduleData] = useState("")
  const [error, setError] = useState("")

  const handleExport = async () => {
    if (!scheduleData.trim()) {
      setError("Please paste your schedule data before generating.")
      return
    }

    try {
      const response = await fetch("/api/generate-ics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scheduleData }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate ICS file")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "uwaterloo_schedule.ics"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      setError("")
    } catch (err) {
      setError("An error occurred while generating the ICS file. Please try again.")
    }
  }

  return (
    <section id="export" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Export Your Quest Schedule</h2>
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader className="bg-blue-600 text-white">
            <CardTitle className="flex items-center justify-center text-2xl">
              <Calendar className="mr-2" /> Generate iCalendar File
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4 rounded-r-lg shadow-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Before generating the file, ensure your Chrome‘s primary language is set to be <strong>English (Canada)</strong> at the top of the list. This ensures proper schedule data formatting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
              <h3 className="font-semibold text-xl mb-4 text-blue-700">How to use:</h3>
              <ol className="space-y-4">
                {[
                  <>Log into Quest at <a href="https://quest.pecs.uwaterloo.ca/psp/SS/?cmd=login" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://quest.pecs.uwaterloo.ca/psp/SS/?cmd=login</a></>,
                  'Click "Class Schedule" in the Quest menu',
                  'Choose your term and click the "Continue" button',
                  'Ensure you are in "List View". Copy the whole page by pressing Ctrl+A and then Ctrl+C',
                  "Paste everything into the text field below by pressing Ctrl+V",
                  'Click "Generate" to create and download your iCalendar file'
                ].map((step, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-2 flex-shrink-0 mt-1" />
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <Textarea
              placeholder="Paste your schedule data here..."
              value={scheduleData}
              onChange={(e) => setScheduleData(e.target.value)}
              className="min-h-[200px] mb-4 border-2 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
            {error && (
              <div className="mb-4 border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg shadow-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Button onClick={handleExport} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Generate iCalendar File</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

