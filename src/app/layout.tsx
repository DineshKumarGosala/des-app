import './globals.css'

export const metadata = {
  title: 'Student Feedback System',
  description: 'A comprehensive feedback collection system for educational institutions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="desktop-container">
        <div className="min-h-screen flex flex-col">
          <header className="desktop-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Student Feedback System
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Desktop Application
                </span>
              </div>
            </div>
          </header>
          
          <main className="desktop-main">
            {children}
          </main>
          
          <footer className="desktop-footer">
            <p>&copy; 2025 Student Feedback System. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
