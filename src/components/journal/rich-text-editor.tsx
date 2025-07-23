"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  ImageIcon,
  LinkIcon,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  // In a real implementation, this would use a proper rich text editor library
  // like TipTap, Lexical, or Slate. For this demo, we're using a simple textarea.

  const handleFormat = (format: string) => {
    // This is a simplified example. In a real app, you would apply formatting
    // to the selected text or at the cursor position.
    console.log(`Applying ${format} formatting`)
  }

  return (
    <div className="border rounded-md">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => handleFormat("bold")}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleFormat("italic")}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleFormat("underline")}>
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button variant="ghost" size="icon" onClick={() => handleFormat("align-left")}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleFormat("align-center")}>
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleFormat("align-right")}>
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button variant="ghost" size="icon" onClick={() => handleFormat("bullet-list")}>
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleFormat("numbered-list")}>
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Button variant="ghost" size="icon" onClick={() => handleFormat("image")}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => handleFormat("link")}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[300px] border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
        placeholder="Write your journal entry here..."
      />
    </div>
  )
}

function Textarea({
  value,
  onChange,
  className,
  placeholder,
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className={cn(
        "flex w-full rounded-md bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      placeholder={placeholder}
    />
  )
}
