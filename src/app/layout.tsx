import type React from "react"
import "@/app/globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BookOpen, Home, User } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> 
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-6">
                  <Link href="/" className="font-semibold text-lg">
                    For The Plot
                  </Link>
                  <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                      Home
                    </Link>
                    <Link href="/journal" className="text-muted-foreground hover:text-foreground transition-colors">
                      Journal
                    </Link>
                    <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                      Profile
                    </Link>
                  </nav>
                </div>
                <div className="flex items-center gap-2">
                  <ModeToggle />
                </div>
              </div>
            </header>
            <div className="flex-1">{children}</div>
            <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-10">
              <div className="flex items-center justify-around h-16">
                <Link href="/">
                  <Button variant="ghost" size="icon">
                    <Home className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/journal">
                  <Button variant="ghost" size="icon">
                    <BookOpen className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
