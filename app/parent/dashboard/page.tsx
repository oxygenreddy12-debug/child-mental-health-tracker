"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"
import AssessmentReports from "@/components/parent/assessment-reports"
import EmotionAnalysisReports from "@/components/parent/emotion-analysis-reports"
import DashboardSummary from "@/components/parent/dashboard-summary"
import ExportReports from "@/components/parent/export-reports"

export default function ParentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [assessments, setAssessments] = useState<any[]>([])
  const [analyses, setAnalyses] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "parent") {
      router.push("/")
      return
    }

    setUser(parsedUser)
    setLoading(false)

    const fetchData = async () => {
      try {
        const [assessmentsRes, analysesRes] = await Promise.all([
          fetch(`/api/assessments?parentId=${user?.id}`),
          fetch(`/api/emotion-analysis?parentId=${user?.id}`),
        ])

        const assessmentsData = await assessmentsRes.json()
        const analysesData = await analysesRes.json()

        setAssessments(assessmentsData.assessments || [])
        setAnalyses(analysesData.analyses || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    if (user?.id) {
      fetchData()
    }
  }, [router, user?.id])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
            <p className="text-sm text-gray-600">Monitor your children's mental health</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <DashboardSummary parentId={user?.id} />

        <div className="mt-8">
          <Tabs defaultValue="assessments" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="assessments">Daily Assessments</TabsTrigger>
              <TabsTrigger value="emotion">Emotion Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="assessments" className="space-y-4">
              <AssessmentReports parentId={user?.id} />
            </TabsContent>

            <TabsContent value="emotion" className="space-y-4">
              <EmotionAnalysisReports parentId={user?.id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-8">
          <ExportReports assessments={assessments} analyses={analyses} />
        </div>
      </main>
    </div>
  )
}
