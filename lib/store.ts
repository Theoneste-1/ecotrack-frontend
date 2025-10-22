"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ActivityCategory = "transport" | "energy" | "waste" | "water" | "food"

export interface Activity {
  id: string
  category: ActivityCategory
  type: string
  amount: number
  unit: string
  date: string
  carbonFootprint: number
  notes?: string
}

export interface Goal {
  id: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string
  category: ActivityCategory
}

export interface Tip {
  id: string
  title: string
  description: string
  category: ActivityCategory
  impact: "low" | "medium" | "high"
}

interface StoreState {
  activities: Activity[]
  goals: Goal[]
  tips: Tip[]
  addActivity: (activity: Omit<Activity, "id">) => void
  updateActivity: (id: string, activity: Partial<Activity>) => void
  deleteActivity: (id: string) => void
  addGoal: (goal: Omit<Goal, "id">) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      activities: [],
      goals: [],
      tips: [
        {
          id: "1",
          title: "Switch to LED Bulbs",
          description: "LED bulbs use 75% less energy and last 25 times longer than incandescent lighting.",
          category: "energy",
          impact: "medium",
        },
        {
          id: "2",
          title: "Use Public Transport",
          description: "Taking public transport instead of driving can reduce your carbon footprint by up to 45%.",
          category: "transport",
          impact: "high",
        },
        {
          id: "3",
          title: "Reduce Food Waste",
          description: "Plan meals ahead and store food properly to reduce waste by up to 30%.",
          category: "food",
          impact: "medium",
        },
        {
          id: "4",
          title: "Fix Leaky Faucets",
          description: "A dripping faucet can waste up to 3,000 gallons of water per year.",
          category: "water",
          impact: "low",
        },
      ],
      addActivity: (activity) =>
        set((state) => ({
          activities: [...state.activities, { ...activity, id: Date.now().toString() }],
        })),
      updateActivity: (id, activity) =>
        set((state) => ({
          activities: state.activities.map((a) => (a.id === id ? { ...a, ...activity } : a)),
        })),
      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),
      addGoal: (goal) =>
        set((state) => ({
          goals: [...state.goals, { ...goal, id: Date.now().toString() }],
        })),
      updateGoal: (id, goal) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),
    }),
    {
      name: "ecotrack-storage",
    },
  ),
)
