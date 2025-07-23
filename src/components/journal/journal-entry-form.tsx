"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Music, Plus, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import SpotifySearch from "@/components/journal/spotify-search"
import RichTextEditor from "@/components/journal/rich-text-editor"
import ImageUploader from "@/components/journal/image-uploader"

const categories = ["Family", "Relationships", "Self", "Career", "State of the world", "Slice of life", "Adventures"]

const emotions = ["Optimistic", "Sad", "Profound", "Excited", "Anxious", "Grateful", "Angry"]

const challenges = ["Daily Skateboarding", "Rejection Therapy"]

export default function JournalEntryForm() {
  const [date, setDate] = useState<Date>(new Date())
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedSong, setSelectedSong] = useState<{ title: string; artist: string } | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [people, setPeople] = useState<{ name: string; id: string }[]>([])
  const [newPerson, setNewPerson] = useState("")
  const [challengeProgress, setChallengeProgress] = useState<Record<string, string>>({})
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  const handleAddPerson = () => {
    if (newPerson.trim()) {
      const personId = newPerson.toLowerCase().replace(/\s+/g, "-")
      setPeople([...people, { name: newPerson.trim(), id: personId }])
      setNewPerson("")
    }
  }

  const handleRemovePerson = (id: string) => {
    setPeople(people.filter((person) => person.id !== id))
  }

  const handleAddImage = (imageUrl: string) => {
    setImages([...images, imageUrl])
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleChallengeProgressChange = (challenge: string, progress: string) => {
    setChallengeProgress({
      ...challengeProgress,
      [challenge]: progress,
    })
  }

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion))
    } else {
      setSelectedEmotions([...selectedEmotions, emotion])
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Journal Entry</h1>
        <Button>Save Entry</Button>
      </div>

      <div className="flex items-center gap-4">
        <Popover open={openPopover === "date"} onOpenChange={(open) => setOpenPopover(open ? "date" : null)}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <CalendarIcon className="h-4 w-4" />
              {format(date, "MMMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date || new Date())
                setOpenPopover(null)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover open={openPopover === "song"} onOpenChange={(open) => setOpenPopover(open ? "song" : null)}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Music className="h-4 w-4" />
              {selectedSong ? "Change Song" : "Add Song of the Day"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <SpotifySearch
              onSelect={(song) => {
                setSelectedSong(song)
                setOpenPopover(null)
              }}
            />
          </PopoverContent>
        </Popover>

        <ImageUploader onImageUpload={handleAddImage} />
      </div>

      {selectedSong && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
          <Music className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium">{selectedSong.title}</p>
            <p className="text-sm text-muted-foreground">{selectedSong.artist}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSelectedSong(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image || "/placeholder.svg"}
                alt={`Journal image ${index + 1}`}
                className="h-40 w-full object-cover rounded-md"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-3xl font-bold border-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      <RichTextEditor value={content} onChange={setContent} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Emotions</h3>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion) => (
                    <Badge
                      key={emotion}
                      variant={
                        selectedEmotions.includes(emotion)
                          ? emotion.toLowerCase() === "optimistic"
                            ? "default"
                            : emotion.toLowerCase() === "sad"
                              ? "destructive"
                              : "secondary"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleEmotion(emotion)}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">People Mentioned</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {people.map((person) => (
                    <Badge key={person.id} variant="secondary" className="pl-2 pr-1 flex items-center gap-1">
                      {person.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 hover:bg-transparent"
                        onClick={() => handleRemovePerson(person.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add person..."
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddPerson()
                      }
                    }}
                  />
                  <Button variant="outline" onClick={handleAddPerson}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Challenge Progress</h3>
                <div className="space-y-3">
                  {challenges.map((challenge) => (
                    <div key={challenge}>
                      <div className="text-sm font-medium mb-1">{challenge}</div>
                      <Textarea
                        placeholder={`How did you do with ${challenge} today?`}
                        value={challengeProgress[challenge] || ""}
                        onChange={(e) => handleChallengeProgressChange(challenge, e.target.value)}
                        className="min-h-[80px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
