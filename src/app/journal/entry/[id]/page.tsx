"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, Music } from "lucide-react"
import Link from "next/link"
import { mockEntries } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export default function EntryPage() {
  const { id } = useParams()
  const [entry, setEntry] = useState<any>(null)
  const [reflection, setReflection] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // In a real app, fetch from API
    const foundEntry = mockEntries.find((e) => e.id === id)
    if (foundEntry) {
      setEntry(foundEntry)
      //setReflection(foundEntry.reflection || "")
    }
  }, [id])

  if (!entry) {
    return <div className="p-8 text-center">Loading entry...</div>
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <Link href="/journal">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Journal
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Entry
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Calendar className="h-4 w-4" />
        <span>{entry.date}</span>
      </div>

      <h1 className="text-3xl font-bold mb-4">{entry.title}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {entry.emotions.map((emotion: string, i: number) => (
          <Badge key={i} variant={emotion === "optimistic" ? "default" : emotion === "sad" ? "destructive" : "outline"}>
            {emotion}
          </Badge>
        ))}
        {entry.categories.map((category: string, i: number) => (
          <Badge key={i} variant="secondary">
            {category}
          </Badge>
        ))}
      </div>

      {entry.song && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md mb-6">
          <Music className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{entry.song.title}</p>
            <p className="text-sm text-muted-foreground">{entry.song.artist}</p>
          </div>
        </div>
      )}

      {entry.images && entry.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {entry.images.map((image: string, i: number) => (
            <img
              key={i}
              src={image || "/placeholder.svg"}
              alt={`Journal image ${i + 1}`}
              className="rounded-md w-full h-40 object-cover"
            />
          ))}
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none mb-8">
        <div dangerouslySetInnerHTML={{ __html: entry.contentHtml }} />
      </div>

      {entry.people && entry.people.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">People Mentioned</h3>
          <div className="flex flex-wrap gap-3">
            {entry.people.map((person: any, i: number) => (
              <div key={i} className="flex items-center gap-2 p-2 border rounded-md">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{person.name[0]}</AvatarFallback>
                </Avatar>
                <span>{person.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {entry.challenges && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Challenge Progress</h3>
          <div className="space-y-3">
            {Object.entries(entry.challenges).map(([challenge, progress]: [string, any]) => (
              <div key={challenge} className="p-3 border rounded-md">
                <div className="font-medium">{challenge}</div>
                <p className="text-sm">{progress}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-8" />

      <Tabs defaultValue="reflection">
        <TabsList className="mb-4">
          <TabsTrigger value="reflection">Looking Back</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="reflection" className="space-y-4">
          <h3 className="text-lg font-medium">Reflection</h3>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Add your thoughts looking back on this entry..."
            className="w-full min-h-[150px] p-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={!isEditing}
          />
          {isEditing && <Button className="mt-2">Save Reflection</Button>}
        </TabsContent>
        <TabsContent value="stats">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Entry Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <div className="text-sm text-muted-foreground">Word Count</div>
                <div className="text-2xl font-bold">{entry.contentHtml.split(" ").length}</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-muted-foreground">People Mentioned</div>
                <div className="text-2xl font-bold">{entry.people?.length || 0}</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
