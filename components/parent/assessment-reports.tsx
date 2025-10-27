"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface AssessmentReportsProps {
  parentId: string
}

export default function AssessmentReports({ parentId }: AssessmentReportsProps) {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState<string>("all")

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch(`/api/assessments?parentId=${parentId}`)
        const data = await response.json()
        setAssessments(data.assessments || [])
      } catch (error) {
        console.error("Error fetching assessments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [parentId])

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      "very-happy": "bg-green-100 text-green-800",
      happy: "bg-blue-100 text-blue-800",
      neutral: "bg-gray-100 text-gray-800",
      sad: "bg-orange-100 text-orange-800",
      "very-sad": "bg-red-100 text-red-800",
    }
    return colors[mood] || "bg-gray-100 text-gray-800"
  }

  const getEnergyColor = (energy: string) => {
    const colors: Record<string, string> = {
      "very-high": "bg-green-100 text-green-800",
      high: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-red-100 text-red-800",
    }
    return colors[energy] || "bg-gray-100 text-gray-800"
  }

  const filteredAssessments =
    selectedChild === "all" ? assessments : assessments.filter((a) => a.childName === selectedChild)

  const children = Array.from(new Set(assessments.map((a) => a.childName)))

  const getMoodStats = () => {
    const moodCounts: Record<string, number> = {}
    filteredAssessments.forEach((a) => {
      moodCounts[a.mood] = (moodCounts[a.mood] || 0) + 1
    })
    return Object.entries(moodCounts).map(([mood, count]) => ({
      name: mood.replace("-", " "),
      value: count,
    }))
  }

  const getEnergyTrend = () => {
    const energyMap: Record<string, number> = {
      "very-high": 4,
      high: 3,
      medium: 2,
      low: 1,
    }
    return filteredAssessments
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-7)
      .map((a) => ({
        date: new Date(a.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        energy: energyMap[a.energy] || 0,
      }))
  }

  const COLORS = ["#10b981", "#3b82f6", "#6b7280", "#f97316", "#ef4444"]

  if (loading) {
    return <div className="text-center py-8">Loading assessments...</div>
  }

  if (assessments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Assessments</CardTitle>
          <CardDescription>No assessments yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Your children haven't submitted any daily check-ins yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Daily Assessment Reports</h2>
          <p className="text-sm text-gray-600">Track your children's daily check-ins and trends</p>
        </div>
        <Select value={selectedChild} onValueChange={setSelectedChild}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select child" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Children</SelectItem>
            {children.map((child) => (
              <SelectItem key={child} value={child}>
                {child}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Check-ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredAssessments.length}</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold capitalize">
              {filteredAssessments.length > 0
                ? filteredAssessments[filteredAssessments.length - 1].mood.replace("-", " ")
                : "N/A"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Most recent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sleep Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold capitalize">
              {filteredAssessments.length > 0 ? filteredAssessments[filteredAssessments.length - 1].sleep : "N/A"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Most recent</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Breakdown of mood entries</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getMoodStats()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getMoodStats().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Level Trend</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getEnergyTrend()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Line type="monotone" dataKey="energy" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
          <CardDescription>Latest daily assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssessments
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5)
              .map((assessment) => (
                <div key={assessment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{assessment.childName}</p>
                      <p className="text-xs text-gray-500">{new Date(assessment.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={getMoodColor(assessment.mood)}>{assessment.mood.replace("-", " ")}</Badge>
                    <Badge className={getEnergyColor(assessment.energy)}>{assessment.energy.replace("-", " ")}</Badge>
                    <Badge className="bg-purple-100 text-purple-800">{assessment.sleep}</Badge>
                  </div>
                  {assessment.notes && <p className="text-sm text-gray-600 mt-2 italic">"{assessment.notes}"</p>}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
