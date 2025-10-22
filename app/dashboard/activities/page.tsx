"use client"

import type React from "react"

import { useState } from "react"
import { useStore, type Activity, type ActivityCategory } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const categoryOptions: { value: ActivityCategory; label: string }[] = [
  { value: "transport", label: "Transport" },
  { value: "energy", label: "Energy" },
  { value: "waste", label: "Waste" },
  { value: "water", label: "Water" },
  { value: "food", label: "Food" },
]

export default function ActivitiesPage() {
  const { activities, addActivity, updateActivity, deleteActivity } = useStore()
  const [filterCategory, setFilterCategory] = useState<ActivityCategory | "all">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const { toast } = useToast()

  const filteredActivities =
    filterCategory === "all" ? activities : activities.filter((a) => a.category === filterCategory)

  const handleDelete = (id: string) => {
    deleteActivity(id)
    toast({
      title: "Activity deleted",
      description: "The activity has been removed.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground">Manage and track all your environmental activities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Activity</DialogTitle>
              <DialogDescription>Log a new environmental activity</DialogDescription>
            </DialogHeader>
            <ActivityForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>View and manage your tracked activities</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v as ActivityCategory | "all")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredActivities.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Carbon (kg)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{activity.category}</Badge>
                    </TableCell>
                    <TableCell>{activity.type}</TableCell>
                    <TableCell>
                      {activity.amount} {activity.unit}
                    </TableCell>
                    <TableCell>{activity.carbonFootprint.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setEditingActivity(activity)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Activity</DialogTitle>
                              <DialogDescription>Update activity details</DialogDescription>
                            </DialogHeader>
                            <ActivityForm activity={editingActivity} onSuccess={() => setEditingActivity(null)} />
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(activity.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              No activities found. Start tracking your environmental impact!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityForm({ activity, onSuccess }: { activity?: Activity | null; onSuccess: () => void }) {
  const { addActivity, updateActivity } = useStore()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    category: activity?.category || ("transport" as ActivityCategory),
    type: activity?.type || "",
    amount: activity?.amount.toString() || "",
    date: activity?.date ? new Date(activity.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    notes: activity?.notes || "",
  })

  const calculateCarbon = (cat: ActivityCategory, amt: number) => {
    const factors: Record<ActivityCategory, number> = {
      transport: 0.12,
      energy: 0.5,
      waste: 0.3,
      water: 0.001,
      food: 2.5,
    }
    return amt * factors[cat]
  }

  const getUnit = (cat: ActivityCategory) => {
    const units: Record<ActivityCategory, string> = {
      transport: "km",
      energy: "kWh",
      waste: "kg",
      water: "liters",
      food: "kg",
    }
    return units[cat]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = Number.parseFloat(formData.amount)
    if (isNaN(amountNum)) return

    const carbonFootprint = calculateCarbon(formData.category, amountNum)
    const activityData = {
      category: formData.category,
      type: formData.type,
      amount: amountNum,
      unit: getUnit(formData.category),
      date: new Date(formData.date).toISOString(),
      carbonFootprint,
      notes: formData.notes,
    }

    if (activity) {
      updateActivity(activity.id, activityData)
      toast({ title: "Activity updated!", description: "Your changes have been saved." })
    } else {
      addActivity(activityData)
      toast({ title: "Activity added!", description: "New activity has been logged." })
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => setFormData({ ...formData, category: v as ActivityCategory })}
          >
            <SelectTrigger id="category">
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

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            placeholder="e.g., Car, Bus, Train"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount ({getUnit(formData.category)})</Label>
          <Input
            id="amount"
            type="number"
            step="0.1"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any additional details..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        {activity ? "Update Activity" : "Add Activity"}
      </Button>
    </form>
  )
}
