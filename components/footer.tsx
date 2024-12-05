import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} UWPilot. All rights reserved.</p>
        <nav className="mt-4">
          <ul className="flex justify-center space-x-4">
            <li><a href="#team" className="hover:text-purple-400">Our Team</a></li>
            <li><a href="mailto:uwpilotapp@gmail.com" className="hover:text-purple-400">Contact Us</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

