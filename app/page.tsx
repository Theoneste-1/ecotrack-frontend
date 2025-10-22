import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TrendingDown, Target, Lightbulb } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background dark:from-green-950/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
              <Leaf className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 text-balance">Track Your Environmental Impact</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Monitor your carbon footprint, set sustainability goals, and make a positive impact on the planet.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-fit mb-2">
                <TrendingDown className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Track Activities</CardTitle>
              <CardDescription>
                Log your daily activities and see their environmental impact in real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 w-fit mb-2">
                <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Set Goals</CardTitle>
              <CardDescription>
                Create sustainability goals and track your progress towards a greener lifestyle.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-3 w-fit mb-2">
                <Lightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <CardTitle>Get Tips</CardTitle>
              <CardDescription>Receive personalized tips and insights to reduce your carbon footprint.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
