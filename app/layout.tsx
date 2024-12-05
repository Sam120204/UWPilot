import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UWPilot - Course Planning for University of Waterloo",
  description: "UWPilot is the ultimate course planning tool for University of Waterloo students. Visualize course pathways, understand prerequisites, and plan your academic schedule with ease.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <script dangerouslySetInnerHTML={{__html: `
          document.addEventListener('click', function(e) {
            if(e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
              e.preventDefault();
              var id = e.target.getAttribute('href').slice(1);
              var element = document.getElementById(id);
              if(element) {
                element.scrollIntoView({behavior: 'smooth'});
              }
            }
          });
        `}} />
      </body>
    </html>
  )
}

