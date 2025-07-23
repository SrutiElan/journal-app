"use client"

import { Progress } from "@/components/ui/progress"

export default function ChallengeTracker() {
  const challenges = [
    {
      name: "Daily Skateboarding",
      progress: 85,
      streak: 17,
      total: 20,
    },
    {
      name: "Rejection Therapy",
      progress: 40,
      streak: 8,
      total: 30,
    },
  ]

  return (
    <div className="space-y-4">
      {challenges.map((challenge, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-medium">{challenge.name}</div>
            <div className="text-sm text-muted-foreground">{challenge.streak} day streak</div>
          </div>
          <Progress value={challenge.progress} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">
            {Math.round(challenge.progress)}% complete (
            {challenge.total - Math.round((challenge.progress * challenge.total) / 100)} days left)
          </div>
        </div>
      ))}
    </div>
  )
}
