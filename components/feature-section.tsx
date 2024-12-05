import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Search, TreePine, Mail, Users } from 'lucide-react'

const features = [
  {
    title: "Course Explorer",
    description: "Search and explore courses with detailed information and prerequisites.",
    icon: Search,
  },
  {
    title: "Prerequisite Tree",
    description: "Visualize course connections and plan your academic journey.",
    icon: TreePine,
  },
  {
    title: "Schedule Importer",
    description: "Easily import your current schedule from QUEST.",
    icon: Calendar,
  },
  {
    title: "Academic Planning",
    description: "Plan future terms and track your progress towards graduation.",
    icon: BookOpen,
  },
  {
    title: "Email Notifications",
    description: "Receive your schedule ICS file and course descriptions via email.",
    icon: Mail,
  },
  {
    title: "User Switch",
    description: "Easily switch between multiple user profiles or accounts.",
    icon: Users,
  },
]

export function FeatureSection() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-purple-100 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardHeader>
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-10 h-10 text-purple-600" />
                </div>
                <CardTitle className="text-center text-2xl mb-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 text-lg">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="text-center mt-16 text-gray-600 text-lg">
          All features are available in the Windows Desktop version of UWPilot.
        </p>
      </div>
    </section>
  )
}

