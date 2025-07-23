"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockEntries } from "@/lib/mock-data"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export default function EmotionChart() {
  const [timeRange, setTimeRange] = useState("month")

  // Count emotions across all entries
  const emotionCounts: Record<string, number> = {}
  mockEntries.forEach((entry) => {
    entry.emotions.forEach((emotion) => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
    })
  })

  const data = Object.entries(emotionCounts).map(([name, value]) => ({ name, value }))

  const COLORS = ["#4f46e5", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6b7280"]

  return (
    <div className="space-y-4">
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">Past Week</SelectItem>
          <SelectItem value="month">Past Month</SelectItem>
          <SelectItem value="year">Past Year</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} entries`, "Count"]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
