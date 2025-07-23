"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Music, Plus, Search, User } from "lucide-react"
import { mockEntries } from "@/lib/mock-data"
import EmotionChart from "@/components/journal/emotion-chart"
import ChallengeTracker from "@/components/journal/challenge-tracker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JournalDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterEmotion, setFilterEmotion] = useState<string | null>(null)

  const filteredEntries = mockEntries.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !filterCategory || entry.categories.includes(filterCategory)
    const matchesEmotion = !filterEmotion || entry.emotions.includes(filterEmotion)

    return matchesSearch && matchesCategory && matchesEmotion
  })

  const categories = Array.from(new Set(mockEntries.flatMap((entry) => entry.categories)))
  const emotions = Array.from(new Set(mockEntries.flatMap((entry) => entry.emotions)))

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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries, tags, or people..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select onValueChange={(value) => setFilterCategory(value === "all" ? null : value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setFilterEmotion(value === "all" ? null : value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Emotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Emotions</SelectItem>
                {emotions.map((emotion) => (
                  <SelectItem key={emotion} value={emotion}>
                    {emotion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <Link href={`/journal/entry/${entry.id}`} key={entry.id}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{entry.date}</span>
                        </div>
                        {entry.song && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Music className="h-4 w-4" />
                            <span>{entry.song.title}</span>
                          </div>
                        )}
                      </div>
                      <CardTitle>{entry.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">{entry.content.replace(/<[^>]*>/g, "")}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {entry.emotions.map((emotion, i) => (
                          <Badge
                            key={i}
                            variant={
                              emotion === "optimistic" ? "default" : emotion === "sad" ? "destructive" : "outline"
                            }
                          >
                            {emotion}
                          </Badge>
                        ))}
                        {entry.categories.slice(0, 2).map((category, i) => (
                          <Badge key={i} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                        {entry.categories.length > 2 && (
                          <Badge variant="secondary">+{entry.categories.length - 2}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No entries found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotions</CardTitle>
              <CardDescription>How you've been feeling lately</CardDescription>
            </CardHeader>
            <CardContent>
              <EmotionChart />
            </CardContent>
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
                {[
                  { name: "Mom", count: 15, sentiment: "positive" },
                  { name: "Alex", count: 12, sentiment: "mixed" },
                  { name: "Sarah", count: 8, sentiment: "positive" },
                  { name: "Dad", count: 7, sentiment: "negative" },
                ].map((person, i) => (
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
