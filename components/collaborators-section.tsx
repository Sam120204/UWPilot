import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkedinIcon } from 'lucide-react'

const collaborators = [
  {
    name: "Jiayou Zhong",
    linkedin: "https://www.linkedin.com/in/jiayouz/",
  },
  {
    name: "Shenyan Zheng",
    linkedin: "https://www.linkedin.com/in/shenyan-zheng-0ab064274/",
  },
  {
    name: "Chengrui Li",
    linkedin: "https://www.linkedin.com/in/chengrui-li-bbbb39261/",
  },
  {
    name: "Lingzhi Meng",
    linkedin: "https://www.linkedin.com/in/lingzhi-meng-b7b749197",
  },

]

export function CollaboratorsSection() {
  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {collaborators.map((collaborator, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{collaborator.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">University of Waterloo CS Student</p>
                <a
                  href={collaborator.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  <LinkedinIcon className="w-5 h-5 mr-2" />
                  LinkedIn Profile
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

