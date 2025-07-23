"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Music, X } from "lucide-react"
import SongSelector from "./song-selector"
import ImageUpload from "./image-upload"

export default function JournalEntryForm() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [selectedSong, setSelectedSong] = useState<{ title: string; artist: string } | null>(null)
  const [showSongSelector, setShowSongSelector] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag) {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSongSelect = (song: { title: string; artist: string }) => {
    setSelectedSong(song)
    setShowSongSelector(false)
  }

  const handleImageUpload = (imageUrl: string) => {
    setImages([...images, imageUrl])
  }

  const handleRemoveImage = (imageToRemove: string) => {
    setImages(images.filter((image) => image !== imageToRemove))
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0">
        <div className="space-y-6">
          {/* Date Selector */}
          <div className="flex items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-9 pl-0 pr-2 text-muted-foreground font-normal hover:bg-transparent hover:text-foreground"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM d, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="border-none text-3xl font-bold px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Images */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Journal image ${index + 1}`}
                    className="h-40 w-auto object-cover rounded-md"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80"
                    onClick={() => handleRemoveImage(image)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Content */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts here..."
            className="min-h-[200px] border-none resize-none px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Song Selection */}
          {selectedSong && (
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
              <Music className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedSong.title}</p>
                <p className="text-xs text-muted-foreground">{selectedSong.artist}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedSong(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm">
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Input
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleAddTag}
              placeholder="Add a tag..."
              className="border-none w-24 flex-grow px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground bg-transparent"
              onClick={() => setShowSongSelector(!showSongSelector)}
            >
              <Music className="h-4 w-4 mr-2" />
              {selectedSong ? "Change song" : "Add song"}
            </Button>
            <ImageUpload onImageUpload={handleImageUpload} />
            <div className="flex-1" />
            <Button>Save</Button>
          </div>

          {/* Song Selector */}
          {showSongSelector && <SongSelector onSelect={handleSongSelect} />}
        </div>
      </CardContent>
    </Card>
  )
}
