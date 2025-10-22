"use client"

import type React from "react"

import { useState } from "react"
import { useStore, type Goal, type ActivityCategory } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Target } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const categoryOptions: { value: ActivityCategory; label: string }[] = [
  { value: "transport", label: "Transport" },
  { value: "energy", label: "Energy" },
  { value: "waste", label: "Waste" },
  { value: "water", label: "Water" },
  { value: "food", label: "Food" },
]

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const activeGoals = goals.filter((g) => new Date(g.deadline) > new Date())
  const completedGoals = goals.filter((g) => new Date(g.deadline) <= new Date())

  const handleDelete = (id: string) => {
    deleteGoal(id)
    toast({
      title: "Goal deleted",
      description: "The goal has been removed.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">Set and track your sustainability goals</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>Set a new sustainability target</DialogDescription>
            </DialogHeader>
            <GoalForm onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
          {activeGoals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} onUpdate={updateGoal} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
                No active goals. Create one to start tracking your progress!
              </CardContent>
            </Card>
          )}
        </div>

        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Completed Goals</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {completedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} onUpdate={updateGoal} isCompleted />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function GoalCard({
  goal,
  onDelete,
  onUpdate,
  isCompleted = false,
}: {
  goal: Goal
  onDelete: (id: string) => void
  onUpdate: (id: string, goal: Partial<Goal>) => void
  isCompleted?: boolean
}) {
  const progress = Math.min((goal.current / goal.target) * 100, 100)
  const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {goal.title}
            </CardTitle>
            <CardDescription>
              <Badge variant="outline">{goal.category}</Badge>
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {goal.current} / {goal.target} {goal.unit}
            </span>
          </div>
          <Progress value={progress} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress.toFixed(0)}% complete</span>
            {!isCompleted && <span>{daysLeft > 0 ? `${daysLeft} days left` : "Deadline passed"}</span>}
          </div>
        </div>
        {!isCompleted && (
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Update progress"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = Number.parseFloat((e.target as HTMLInputElement).value)
                  if (!isNaN(value)) {
                    onUpdate(goal.id, { current: value })
                    ;(e.target as HTMLInputElement).value = ""
                  }
                }
              }}
            />
            <Button size="sm" variant="outline">
              Update
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function GoalForm({ onSuccess }: { onSuccess: () => void }) {
  const { addGoal } = useStore()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    category: "transport" as ActivityCategory,
    target: "",
    unit: "kg CO2",
    deadline: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const targetNum = Number.parseFloat(formData.target)
    if (isNaN(targetNum)) return

    addGoal({
      title: formData.title,
      category: formData.category,
      target: targetNum,
      current: 0,
      unit: formData.unit,
      deadline: new Date(formData.deadline).toISOString(),
    })

    toast({
      title: "Goal created!",
      description: "Your new sustainability goal has been set.",
    })

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Goal Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Reduce car usage"
          required
        />
      </div>

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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="target">Target</Label>
          <Input
            id="target"
            type="number"
            step="0.1"
            value={formData.target}
            onChange={(e) => setFormData({ ...formData, target: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="e.g., kg CO2"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline</Label>
        <Input
          id="deadline"
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Create Goal
      </Button>
    </form>
  )
}
