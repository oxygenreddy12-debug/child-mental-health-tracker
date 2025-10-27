"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

interface ExportReportsProps {
  assessments: any[]
  analyses: any[]
}

export default function ExportReports({ assessments, analyses }: ExportReportsProps) {
  const exportToCSV = () => {
    // Prepare assessment data
    const assessmentHeaders = ["Date", "Child Name", "Mood", "Energy", "Sleep", "Notes"]
    const assessmentRows = assessments.map((a) => [
      new Date(a.timestamp).toLocaleString(),
      a.childName,
      a.mood,
      a.energy,
      a.sleep,
      a.notes || "",
    ])

    // Prepare emotion analysis data
    const analysisHeaders = ["Date", "Child Name", "Primary Emotion", "Emotions"]
    const analysisRows = analyses.map((a) => [
      new Date(a.timestamp).toLocaleString(),
      a.childName,
      a.primaryEmotion,
      Object.entries(a.emotions || {})
        .map(([emotion, confidence]: [string, any]) => `${emotion}: ${(confidence * 100).toFixed(0)}%`)
        .join(", "),
    ])

    // Combine all data
    const allData = [
      ["DAILY ASSESSMENTS"],
      assessmentHeaders,
      ...assessmentRows,
      [],
      ["EMOTION ANALYSIS"],
      analysisHeaders,
      ...analysisRows,
    ]

    // Convert to CSV
    const csv = allData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    // Download
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mindcare-report-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Reports</CardTitle>
        <CardDescription>Download your child's data for personal records or professional consultation</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={exportToCSV} className="gap-2" disabled={assessments.length === 0 && analyses.length === 0}>
          <Download className="w-4 h-4" />
          Export as CSV
        </Button>
      </CardContent>
    </Card>
  )
}
