"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server or storage service
      // For this demo, we'll create a local URL
      const imageUrl = URL.createObjectURL(file)
      onImageUpload(imageUrl)

      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <Button variant="outline" className="gap-2 bg-transparent" onClick={handleButtonClick}>
        <ImageIcon className="h-4 w-4" />
        Add Images
      </Button>
    </>
  )
}
