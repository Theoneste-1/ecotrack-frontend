"use client"

import type React from "react"

import { useState } from "react"
import { useStore, type ActivityCategory } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const categoryOptions: { value: ActivityCategory; label: string }[] = [
  { value: "transport", label: "Transport" },
  { value: "energy", label: "Energy" },
  { value: "waste", label: "Waste" },
  { value: "water", label: "Water" },
  { value: "food", label: "Food" },
]

const transportTypes = ["Car", "Bus", "Train", "Bike", "Walk"]
const energyTypes = ["Electricity", "Gas", "Solar", "Wind"]
const wasteTypes = ["Recycling", "Compost", "Landfill"]
const waterTypes = ["Shower", "Bath", "Laundry", "Dishes"]
const foodTypes = ["Meat", "Vegetables", "Dairy", "Grains"]

export function QuickAddActivity() {
  const [category, setCategory] = useState<ActivityCategory>("transport")
  const [type, setType] = useState("")
  const [amount, setAmount] = useState("")
  const { addActivity } = useStore()
  const { toast } = useToast()

  const getTypeOptions = () => {
    switch (category) {
      case "transport":
        return transportTypes
      case "energy":
        return energyTypes
      case "waste":
        return wasteTypes
      case "water":
        return waterTypes
      case "food":
        return foodTypes
      default:
        return []
    }
  }

  const getUnit = () => {
    switch (category) {
      case "transport":
        return "km"
      case "energy":
        return "kWh"
      case "waste":
        return "kg"
      case "water":
        return "liters"
      case "food":
        return "kg"
      default:
        return ""
    }
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amountNum = Number.parseFloat(amount)
    if (!type || isNaN(amountNum)) return

    const carbonFootprint = calculateCarbon(category, amountNum)
    addActivity({
      category,
      type,
      amount: amountNum,
      unit: getUnit(),
      date: new Date().toISOString(),
      carbonFootprint,
    })

    toast({
      title: "Activity added!",
      description: `${amountNum} ${getUnit()} of ${type} logged.`,
    })

    setType("")
    setAmount("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as ActivityCategory)}>
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
        <Select value={type} onValueChange={setType}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {getTypeOptions().map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount ({getUnit()})</Label>
        <Input
          id="amount"
          type="number"
          step="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Add Activity
      </Button>
    </form>
  )
}
