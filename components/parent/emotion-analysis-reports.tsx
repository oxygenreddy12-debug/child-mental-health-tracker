"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

interface EmotionAnalysisReportsProps {
  parentId: string
}

export default function EmotionAnalysisReports({ parentId }: EmotionAnalysisReportsProps) {
  const [analyses, setAnalyses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChild, setSelectedChild] = useState<string>("all")

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch(`/api/emotion-analysis?parentId=${parentId}`)
        const data = await response.json()
        setAnalyses(data.analyses || [])
      } catch (error) {
        console.error("Error fetching analyses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [parentId])

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "bg-green-100 text-green-800",
      sad: "bg-blue-100 text-blue-800",
      angry: "bg-red-100 text-red-800",
      neutral: "bg-gray-100 text-gray-800",
      surprised: "bg-yellow-100 text-yellow-800",
      fearful: "bg-purple-100 text-purple-800",
      depressed: "bg-indigo-100 text-indigo-800",
    }
    return colors[emotion.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  const filteredAnalyses = selectedChild === "all" ? analyses : analyses.filter((a) => a.childName === selectedChild)

  const children = Array.from(new Set(analyses.map((a) => a.childName)))

  const getEmotionAverages = () => {
    if (filteredAnalyses.length === 0) return []

    const emotionTotals: Record<string, number> = {}
    const emotionCounts: Record<string, number> = {}

    filteredAnalyses.forEach((analysis) => {
      Object.entries(analysis.emotions || {}).forEach(([emotion, confidence]: [string, any]) => {
        emotionTotals[emotion] = (emotionTotals[emotion] || 0) + confidence
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1
      })
    })

    return Object.entries(emotionTotals).map(([emotion, total]) => ({
      emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
      value: Math.round((total / emotionCounts[emotion]) * 100),
    }))
  }

  const getEmotionTrend = () => {
    return filteredAnalyses
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-7)
      .map((a) => ({
        date: new Date(a.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        primary: a.primaryEmotion,
      }))
  }

  if (loading) {
    return <div className="text-center py-8">Loading emotion analyses...</div>
  }

  if (analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Emotion Analysis Reports</CardTitle>
          <CardDescription>No analyses yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Your children haven't submitted any video analyses yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Emotion Analysis Reports</h2>
          <p className="text-sm text-gray-600">Monitor emotional patterns from video analyses</p>
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredAnalyses.length}</div>
            <p className="text-xs text-gray-500 mt-1">Video analyses completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Primary Emotion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold capitalize">
              {filteredAnalyses.length > 0 ? filteredAnalyses[filteredAnalyses.length - 1].primaryEmotion : "N/A"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Most recent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Positive Emotions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {filteredAnalyses.length > 0
                ? Math.round(
                    (filteredAnalyses.filter((a) => ["happy", "surprised"].includes(a.primaryEmotion.toLowerCase()))
                      .length /
                      filteredAnalyses.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-gray-500 mt-1">Of analyses</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emotion Profile</CardTitle>
            <CardDescription>Average emotion confidence levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={getEmotionAverages()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="emotion" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Confidence %" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
            <CardDescription>Breakdown of primary emotions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getEmotionAverages()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Video Analyses</CardTitle>
          <CardDescription>Latest emotion analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAnalyses
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 5)
              .map((analysis) => (
                <div key={analysis.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">{analysis.childName}</p>
                      <p className="text-xs text-gray-500">{new Date(analysis.timestamp).toLocaleString()}</p>
                    </div>
                    <Badge className={getEmotionColor(analysis.primaryEmotion)}>{analysis.primaryEmotion}</Badge>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(analysis.emotions || {})
                      .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                      .slice(0, 3)
                      .map(([emotion, confidence]: [string, any]) => (
                        <div key={emotion} className="flex justify-between items-center text-sm">
                          <span className="capitalize text-gray-600">{emotion}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full"
                                style={{ width: `${confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 w-10 text-right">
                              {(confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
