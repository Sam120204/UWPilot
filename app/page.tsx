import { HeroSection } from '@/components/hero-section'
import { FeatureSection } from '@/components/feature-section'
import { DownloadSection } from '@/components/download-section'
import { ExportScheduleSection } from '@/components/export-schedule-section'
import { CollaboratorsSection } from '@/components/collaborators-section'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection id="top" />
        <FeatureSection />
        <DownloadSection />
        <ExportScheduleSection />
        <CollaboratorsSection />
      </main>
    </div>
  )
}

