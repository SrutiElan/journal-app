"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Edit, Save, X } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { EntryWithImages } from "@/lib/actions"

// // Props interface - this is what we'd receive if using props instead of useParams
// interface EntryPageProps {
//   params: { id: string }
// }

export default function EntryPage() {
  const { id } = useParams()
  const router = useRouter()
  
  // State management
  const [entry, setEntry] = useState<EntryWithImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reflection, setReflection] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [editedTitle, setEditedTitle] = useState("")

  // Fetch entry data on component mount
  useEffect(() => {
    async function fetchEntry() {
      if (!id) return
      
      try {
        setLoading(true)
        setError(null)
        
        // Call our server action via a route handler
        // We can't call server actions directly from client components
        const response = await fetch(`/api/entries/${id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch entry: ${response.statusText}`)
        }
        
        const entryData = await response.json()
        
        if (entryData) {
          setEntry(entryData)
          setReflection(entryData.reflection || "")
          setEditedContent(entryData.contentHtml || "")
          setEditedTitle(entryData.title || "")
        } else {
          setError("Entry not found")
        }
      } catch (err) {
        console.error("Error fetching entry:", err)
        setError(err instanceof Error ? err.message : "Failed to load entry")
      } finally {
        setLoading(false)
      }
    }

    fetchEntry()
  }, [id]) // Dependency array - re-run when id changes

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing && entry) {
      // Reset edited content when canceling edit
      setEditedContent(entry.contentHtml)
      setEditedTitle(entry.title || "")
    }
    setIsEditing(!isEditing)
  }

  // Handle save functionality
  const handleSave = async () => {
    if (!entry || !id) return

    try {
      const formData = new FormData()
      formData.append('title', editedTitle)
      formData.append('contentHtml', editedContent)
      // Keep existing data for other fields
      formData.append('tags', JSON.stringify(entry.tags))
      formData.append('categories', JSON.stringify(entry.categories))
      formData.append('emotions', JSON.stringify(entry.emotions))
      formData.append('people', JSON.stringify(entry.people))
      formData.append('song', JSON.stringify(entry.song))
      formData.append('challenges', JSON.stringify(entry.challenges))
      if (entry.moodScore) {
        formData.append('moodScore', entry.moodScore.toString())
      }

      const response = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to update entry')
      }

      // Update local state with saved data
      setEntry(prev => prev ? {
        ...prev,
        title: editedTitle,
        contentHtml: editedContent,
        updatedAt: new Date()
      } : null)
      
      setIsEditing(false)
    } catch (err) {
      console.error("Error saving entry:", err)
      alert("Failed to save entry. Please try again.")
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading entry...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg text-red-500 mb-2">Error</div>
            <div className="text-muted-foreground">{error}</div>
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Entry not found
  if (!entry) {
    return (
      <div className="container max-w-4xl mx-auto py-6 px-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg mb-2">Entry not found</div>
            <Link href="/journal">
              <Button variant="outline">Back to Journal</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      {/* Header with navigation and actions */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/journal">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Journal
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
              <Button variant="ghost" size="sm" onClick={handleEditToggle}>
                <X className="h-4 w-4 mr-2" /> Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleEditToggle}>
              <Edit className="h-4 w-4 mr-2" /> Edit Entry
            </Button>
          )}
        </div>
      </div>

      {/* Entry metadata */}
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <Calendar className="h-4 w-4" />
        <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Entry title - editable in edit mode */}
      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="text-3xl font-bold mb-4 w-full bg-transparent border-b border-border focus:outline-none focus:border-primary"
          placeholder="Entry title..."
        />
      ) : (
        <h1 className="text-3xl font-bold mb-4">{entry.title || "Untitled"}</h1>
      )}

      {/* Tags display */}
      <div className="flex flex-wrap gap-2 mb-6">
        {entry.emotions.map((emotion: string, i: number) => (
          <Badge 
            key={i} 
            variant={
              emotion === "optimistic" ? "default" : 
              emotion === "sad" ? "destructive" : 
              "outline"
            }
          >
            {emotion}
          </Badge>
        ))}
        {entry.categories.map((category: string, i: number) => (
          <Badge key={i} variant="secondary">
            {category}
          </Badge>
        ))}
      </div>

      {/* Song of the day */}
      {entry.song && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md mb-6">
          <div className="h-5 w-5 text-muted-foreground">🎵</div>
          <div>
            <p className="font-medium">{entry.song.title}</p>
            <p className="text-sm text-muted-foreground">{entry.song.artist}</p>
          </div>
        </div>
      )}

      {/* Images */}
      {entry.images && entry.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {entry.images.map((image: any, i: number) => (
            <img
              key={i}
              src={image.url || "/placeholder.svg"}
              alt={`Journal image ${i + 1}`}
              className="rounded-md w-full h-40 object-cover"
            />
          ))}
        </div>
      )}

      {/* Entry content - editable in edit mode */}
      <div className="mb-8">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full min-h-[300px] p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Write your journal entry..."
          />
        ) : (
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: entry.contentHtml }} 
          />
        )}
      </div>

      {/* People mentioned */}
      {entry.people && Object.keys(entry.people).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">People Mentioned</h3>
          <div className="flex flex-wrap gap-3">
            {Object.keys(entry.people).map((personName: string, i: number) => (
              <div key={i} className="flex items-center gap-2 p-2 border rounded-md">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{personName[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{personName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenge progress */}
      {entry.challenges && Object.keys(entry.challenges).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3">Challenge Progress</h3>
          <div className="space-y-3">
            {Object.entries(entry.challenges).map(([challenge, progress]: [string, any]) => (
              <div key={challenge} className="p-3 border rounded-md">
                <div className="font-medium">{challenge}</div>
                <p className="text-sm">{String(progress)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-8" />

      {/* Reflection tabs */}
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
          />
          <Button className="mt-2">Save Reflection</Button>
        </TabsContent>
        <TabsContent value="stats">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Entry Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <div className="text-sm text-muted-foreground">Word Count</div>
                <div className="text-2xl font-bold">
                  {entry.contentHtml.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
                </div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-muted-foreground">People Mentioned</div>
                <div className="text-2xl font-bold">
                  {entry.people ? Object.keys(entry.people).length : 0}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}