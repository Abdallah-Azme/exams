"use client"

import { useEffect, useState } from "react"
import { Clock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"

type TimerDisplayProps = {
  timeRemaining: number
  onTimeUpdate: (time: number) => void
  onTimeExpired: () => void
}

export function TimerDisplay({ timeRemaining, onTimeUpdate, onTimeExpired }: TimerDisplayProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = timeRemaining - 1
      if (newTime <= 0) {
        onTimeExpired()
        clearInterval(interval)
      } else {
        onTimeUpdate(newTime)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining, onTimeUpdate, onTimeExpired])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const isLowTime = timeRemaining < 300 // Less than 5 minutes

  return (
    <div className="flex items-center gap-2">
      {isVisible ? (
        <div
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-sm ${
            isLowTime ? "bg-warning/10 text-warning" : "bg-muted text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span className="font-medium">{formatTime(timeRemaining)}</span>
        </div>
      ) : (
        <div className="rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground">Timer hidden</div>
      )}
      <Button variant="ghost" size="icon" onClick={() => setIsVisible(!isVisible)} className="h-8 w-8">
        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  )
}
