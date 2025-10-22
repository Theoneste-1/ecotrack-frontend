"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { Activity, TrendingDown, Target, Leaf } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { QuickAddActivity } from "@/components/quick-add-activity"

export default function DashboardPage() {
  const { activities, goals } = useStore()

  const totalCarbonFootprint = activities.reduce((sum, activity) => sum + activity.carbonFootprint, 0)
  const thisMonthActivities = activities.filter((a) => {
    const activityDate = new Date(a.date)
    const now = new Date()
    return activityDate.getMonth() === now.getMonth() && activityDate.getFullYear() === now.getFullYear()
  })
  const thisMonthCarbon = thisMonthActivities.reduce((sum, activity) => sum + activity.carbonFootprint, 0)

  const categoryData = activities.reduce(
    (acc, activity) => {
      const existing = acc.find((item) => item.category === activity.category)
      if (existing) {
        existing.carbon += activity.carbonFootprint
      } else {
        acc.push({ category: activity.category, carbon: activity.carbonFootprint })
      }
      return acc
    },
    [] as { category: string; carbon: number }[],
  )

  const activeGoals = goals.filter((g) => new Date(g.deadline) > new Date())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-balance text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-pretty text-muted-foreground">Welcome back! Here's your environmental impact overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:border-green-900/50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">{activities.length}</div>
            <p className="text-xs text-green-600/80 dark:text-green-400/80">{thisMonthActivities.length} this month</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-cyan-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {totalCarbonFootprint.toFixed(1)} kg
            </div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80">{thisMonthCarbon.toFixed(1)} kg this month</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:border-purple-900/50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{activeGoals.length}</div>
            <p className="text-xs text-purple-600/80 dark:text-purple-400/80">{goals.length} total goals</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:border-amber-900/50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Impact</CardTitle>
            <Leaf className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
              {activities.length > 0 ? (totalCarbonFootprint / activities.length).toFixed(1) : "0"} kg
            </div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80">Per activity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Carbon Footprint by Category</CardTitle>
            <CardDescription>Your environmental impact breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ChartContainer
                config={{
                  carbon: {
                    label: "Carbon (kg)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <defs>
                      <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.65 0.22 155)" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="oklch(0.65 0.22 155)" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="carbon" fill="url(#colorCarbon)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No data available. Start tracking activities!
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Add Activity</CardTitle>
            <CardDescription>Log a new activity quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <QuickAddActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
