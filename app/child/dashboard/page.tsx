"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"
import DailyAssessment from "@/components/child/daily-assessment"
import VideoEmotionAnalysis from "@/components/child/video-emotion-analysis"

export default function ChildDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "child") {
      router.push("/")
      return
    }

    setUser(parsedUser)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <header className="bg-gradient-to-r from-primary to-accent shadow-lg border-b-4 border-primary">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome, {user?.name}! 👋</h1>
            <p className="text-sm text-white/90">Your mental health journey starts here ✨</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 bg-white text-primary hover:bg-primary/10 border-2 border-white font-bold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white border-2 border-primary/20">
            <TabsTrigger
              value="assessment"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white font-bold"
            >
              Daily Check-in
            </TabsTrigger>
            <TabsTrigger
              value="emotion"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white font-bold"
            >
              Emotion Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="space-y-4">
            <DailyAssessment userId={user?.id} userName={user?.name} />
          </TabsContent>

          <TabsContent value="emotion" className="space-y-4">
            <VideoEmotionAnalysis userId={user?.id} userName={user?.name} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
