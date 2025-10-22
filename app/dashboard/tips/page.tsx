"use client"

import { useState } from "react"
import { useStore, type ActivityCategory } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lightbulb, TrendingUp, Filter } from "lucide-react"

const categoryOptions: { value: ActivityCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "transport", label: "Transport" },
  { value: "energy", label: "Energy" },
  { value: "waste", label: "Waste" },
  { value: "water", label: "Water" },
  { value: "food", label: "Food" },
]

const impactColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
}

export default function TipsPage() {
  const { tips } = useStore()
  const [filterCategory, setFilterCategory] = useState<ActivityCategory | "all">("all")

  const filteredTips = filterCategory === "all" ? tips : tips.filter((t) => t.category === filterCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sustainability Tips</h1>
          <p className="text-muted-foreground">Learn how to reduce your environmental impact</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as ActivityCategory | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTips.map((tip) => (
          <Card key={tip.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-2">
                    <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{tip.category}</Badge>
                      <Badge className={impactColors[tip.impact]}>
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {tip.impact} impact
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">{tip.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTips.length === 0 && (
        <Card>
          <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
            No tips available for this category.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
