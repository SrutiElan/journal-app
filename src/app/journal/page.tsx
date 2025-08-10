// This is now a SERVER COMPONENT - no "use client" directive
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Music, Plus, User } from "lucide-react"
import { getEntries, getEmotionStats, getPeopleStats } from '@/lib/actions'
import EmotionChart from "@/components/journal/emotion-chart"
import ChallengeTracker from "@/components/journal/challenge-tracker"
import { ClientDashboard } from "../../components/journal/client-dashboard" // We'll create this

export default async function JournalDashboard() {
  // Fetch data on the server - this runs before the page is sent to client
  const [entries, emotionStats, peopleStats] = await Promise.all([
    getEntries(), // Get all entries
    getEmotionStats(), // Get emotion analytics
    getPeopleStats() // Get people analytics
  ])

  // Extract unique categories and emotions for filters
  const categories = Array.from(new Set(entries.flatMap((entry) => entry.categories)))
  const emotions = Array.from(new Set(entries.flatMap((entry) => entry.emotions)))

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Journal</h1>
          <p className="text-muted-foreground">Because everything is for the plot, right?</p>
        </div>
        <Link href="/journal/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> New Entry
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          {/* Pass server data to client component for interactive filtering */}
          <ClientDashboard 
            entries={entries}
            categories={categories}
            emotions={emotions}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotions</CardTitle>
              <CardDescription>How you've been feeling lately</CardDescription>
            </CardHeader>
            {/* <CardContent>
              <EmotionChart data={emotionStats} />
            </CardContent> */}
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Challenge Progress</CardTitle>
              <CardDescription>Track your ongoing challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <ChallengeTracker />
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View All Challenges
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>People</CardTitle>
              <CardDescription>Most mentioned in your journal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {peopleStats.slice(0, 4).map((person, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{person.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{person.count} entries</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          person.sentiment === "positive"
                            ? "bg-green-500"
                            : person.sentiment === "negative"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View All People
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}