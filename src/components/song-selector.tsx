"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Music } from "lucide-react"

// Mock song data
const mockSongs = [
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Shape of You", artist: "Ed Sheeran" },
  { title: "Someone Like You", artist: "Adele" },
  { title: "Bad Guy", artist: "Billie Eilish" },
  { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
  { title: "Bohemian Rhapsody", artist: "Queen" },
  { title: "Imagine", artist: "John Lennon" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana" },
]

interface SongSelectorProps {
  onSelect: (song: { title: string; artist: string }) => void
}

export default function SongSelector({ onSelect }: SongSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const filteredSongs = mockSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="mt-2 p-4 border rounded-md bg-background">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a song..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsSearching(true)
          }}
          className="pl-8"
        />
      </div>

      {isSearching && (
        <div className="mt-2 max-h-60 overflow-y-auto">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-left h-auto py-2 px-3 my-1"
                onClick={() => onSelect(song)}
              >
                <Music className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-xs text-muted-foreground">{song.artist}</p>
                </div>
              </Button>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-2">No songs found</p>
          )}
        </div>
      )}
    </div>
  )
}
