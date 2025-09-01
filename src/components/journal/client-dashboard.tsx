"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Music, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EntryWithImages } from "@/lib/actions"

interface ClientDashboardProps {
  entries: EntryWithImages[]
  categories: string[]
  emotions: string[]
}

export function ClientDashboard({ entries, categories, emotions }: ClientDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterEmotion, setFilterEmotion] = useState<string | null>(null)

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      (entry.title && entry.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.contentHtml.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !filterCategory || entry.categories.includes(filterCategory)
    const matchesEmotion = !filterEmotion || entry.emotions.includes(filterEmotion)

    return matchesSearch && matchesCategory && matchesEmotion
  })

  return (
    <>
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
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer mb-3">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                    {entry.song && typeof entry.song === 'object' && (entry.song as any).title && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Music className="h-4 w-4" />
                        <span>{(entry.song as any).title}</span>
                      </div>
                    )}
                  </div>
                  <CardTitle>{entry.title || 'Untitled Entry'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">
                    {entry.contentHtml.replace(/<[^>]*>/g, "").substring(0, 200)}...
                  </p>
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
            <p className="text-muted-foreground">
              {entries.length === 0 
                ? "No entries yet. Create your first journal entry!" 
                : "No entries found. Try adjusting your filters."
              }
            </p>
          </div>
        )}
      </div>
    </>
  )
}