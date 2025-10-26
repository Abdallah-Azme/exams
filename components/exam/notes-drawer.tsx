"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

type NotesDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  questionId: string
  initialNote?: string
  onSave: (note: string) => void
}

export function NotesDrawer({ open, onOpenChange, questionId, initialNote = "", onSave }: NotesDrawerProps) {
  const [note, setNote] = useState(initialNote)

  const handleSave = () => {
    onSave(note)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-96">
        <SheetHeader>
          <SheetTitle>Notes</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div>
            <p className="mb-2 text-sm text-muted-foreground">
              Write notes for this question to help you review later.
            </p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter your notes here..."
              className="min-h-64 resize-none"
            />
          </div>
          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Note
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
