"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface DashboardSummaryProps {
  parentId: string
}

export default function DashboardSummary({ parentId }: DashboardSummaryProps) {
  const [assessments, setAssessments] = useState<any[]>([])
  const [analyses, setAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentsRes, analysesRes] = await Promise.all([
          fetch(`/api/assessments?parentId=${parentId}`),
          fetch(`/api/emotion-analysis?parentId=${parentId}`),
        ])

        const assessmentsData = await assessmentsRes.json()
        const analysesData = await analysesRes.json()

        setAssessments(assessmentsData.assessments || [])
        setAnalyses(analysesData.analyses || [])

        // Generate alerts based on patterns
        generateAlerts(assessmentsData.assessments || [], analysesData.analyses || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [parentId])

  const generateAlerts = (assessments: any[], analyses: any[]) => {
    const newAlerts: any[] = []

    // Check for low mood trend
    const recentAssessments = assessments.slice(-7)
    const lowMoodCount = recentAssessments.filter((a) => ["sad", "very-sad"].includes(a.mood)).length
    if (lowMoodCount >= 3) {
      newAlerts.push({
        id: "low-mood",
        type: "warning",
        title: "Low Mood Pattern Detected",
        description: `${lowMoodCount} out of last 7 check-ins show low mood. Consider checking in with your child.`,
      })
    }

    // Check for low energy trend
    const lowEnergyCount = recentAssessments.filter((a) => a.energy === "low").length
    if (lowEnergyCount >= 3) {
      newAlerts.push({
        id: "low-energy",
        type: "warning",
        title: "Low Energy Pattern",
        description: `${lowEnergyCount} out of last 7 check-ins show low energy levels.`,
      })
    }

    // Check for poor sleep
    const poorSleepCount = recentAssessments.filter((a) => a.sleep === "poor").length
    if (poorSleepCount >= 2) {
      newAlerts.push({
        id: "poor-sleep",
        type: "warning",
        title: "Sleep Quality Concern",
        description: `${poorSleepCount} recent check-ins indicate poor sleep quality.`,
      })
    }

    // Check for negative emotions in video analysis
    const recentAnalyses = analyses.slice(-5)
    const negativeEmotionCount = recentAnalyses.filter((a) =>
      ["sad", "angry", "fearful"].includes(a.primaryEmotion.toLowerCase()),
    ).length
    if (negativeEmotionCount >= 2) {
      newAlerts.push({
        id: "negative-emotions",
        type: "info",
        title: "Negative Emotions Detected",
        description: `Recent video analyses show ${negativeEmotionCount} instances of negative emotions.`,
      })
    }

    setAlerts(newAlerts)
  }

  const getOverallMood = () => {
    if (assessments.length === 0) return "N/A"
    const moodMap: Record<string, number> = {
      "very-happy": 5,
      happy: 4,
      neutral: 3,
      sad: 2,
      "very-sad": 1,
    }
    const avgMood = assessments.reduce((sum, a) => sum + (moodMap[a.mood] || 0), 0) / assessments.length
    if (avgMood >= 4) return "Excellent"
    if (avgMood >= 3) return "Good"
    if (avgMood >= 2) return "Fair"
    return "Concerning"
  }

  const getPositiveEmotionPercentage = () => {
    if (analyses.length === 0) return 0
    const positiveCount = analyses.filter((a) => ["happy", "surprised"].includes(a.primaryEmotion.toLowerCase())).length
    return Math.round((positiveCount / analyses.length) * 100)
  }

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={alert.type === "warning" ? "destructive" : "default"}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.title}:</strong> {alert.description}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getOverallMood()}</div>
            <p className="text-xs text-gray-500 mt-1">Based on {assessments.length} check-ins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Positive Emotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{getPositiveEmotionPercentage()}%</div>
            <p className="text-xs text-gray-500 mt-1">Of video analyses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Children</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{new Set(assessments.map((a) => a.childName)).size}</div>
            <p className="text-xs text-gray-500 mt-1">With recent activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{assessments.length + analyses.length}</div>
            <p className="text-xs text-gray-500 mt-1">Check-ins & analyses</p>
          </CardContent>
        </Card>
      </div>

      {/* No Data Message */}
      {assessments.length === 0 && analyses.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>Get started by having your children complete their daily check-ins</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Once your children submit daily assessments and video analyses, you'll see comprehensive reports and
              insights here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
