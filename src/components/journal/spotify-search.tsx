"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Music } from "lucide-react"

// Mock Spotify data
const mockSongs = [
  { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours" },
  { title: "Shape of You", artist: "Ed Sheeran", album: "÷" },
  { title: "Someone Like You", artist: "Adele", album: "21" },
  { title: "Bad Guy", artist: "Billie Eilish", album: "When We All Fall Asleep, Where Do We Go?" },
  { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", album: "Uptown Special" },
  { title: "Bohemian Rhapsody", artist: "Queen", album: "A Night at the Opera" },
  { title: "Imagine", artist: "John Lennon", album: "Imagine" },
  { title: "Smells Like Teen Spirit", artist: "Nirvana", album: "Nevermind" },
]

interface SpotifySearchProps {
  onSelect: (song: { title: string; artist: string }) => void
}

export default function SpotifySearch({ onSelect }: SpotifySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const filteredSongs = mockSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a song..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsSearching(true)
          }}
          className="pl-9"
        />
      </div>

      {isSearching && (
        <div className="max-h-60 overflow-y-auto">
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
                  <p className="text-xs text-muted-foreground">
                    {song.artist} • {song.album}
                  </p>
                </div>
              </Button>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-2">No songs found</p>
          )}
        </div>
      )}

      <div className="text-xs text-center text-muted-foreground">Connect to Spotify for your full library</div>
    </div>
  )
}
