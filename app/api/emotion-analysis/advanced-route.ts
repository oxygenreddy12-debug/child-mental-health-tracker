import { type NextRequest, NextResponse } from "next/server"

// Mock database for emotion analyses
const analyses: any[] = [
  {
    id: "1",
    userId: "1",
    childName: "Ram",
    primaryEmotion: "happy",
    emotions: {
      happy: 0.85,
      neutral: 0.1,
      sad: 0.05,
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
]

// Advanced emotion detection simulation
// In production, this would use TensorFlow.js + face-api.js or similar ML models
function analyzeEmotionFromVideo(videoBlob: Blob): {
  emotions: Record<string, number>
  primaryEmotion: string
  confidence: number
  frames: number
} {
  // Simulate frame-by-frame analysis
  // In production, extract frames from video and run face detection + emotion classification

  const emotionWeights = {
    happy: Math.random() * 0.4 + 0.3,
    neutral: Math.random() * 0.3 + 0.2,
    sad: Math.random() * 0.15,
    angry: Math.random() * 0.1,
    surprised: Math.random() * 0.1,
    fearful: Math.random() * 0.05,
    disgusted: Math.random() * 0.05,
  }

  // Normalize to sum to 1
  const total = Object.values(emotionWeights).reduce((a: number, b: number) => a + b, 0)
  const normalizedEmotions = Object.fromEntries(
    Object.entries(emotionWeights).map(([k, v]: [string, any]) => [k, v / total]),
  )

  // Find primary emotion
  const primaryEmotion = Object.entries(normalizedEmotions).sort(
    ([, a]: [string, any], [, b]: [string, any]) => b - a,
  )[0][0]

  // Calculate confidence (average of top 3 emotions)
  const topEmotions = Object.entries(normalizedEmotions)
    .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
    .slice(0, 3)
    .map(([, v]: [string, any]) => v)
  const confidence = topEmotions.reduce((a, b) => a + b, 0) / topEmotions.length

  return {
    emotions: normalizedEmotions,
    primaryEmotion,
    confidence,
    frames: Math.floor(Math.random() * 100) + 50, // Simulated frame count
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get("userId") as string
    const userName = formData.get("userName") as string
    const video = formData.get("video") as Blob

    if (!video) {
      return NextResponse.json({ error: "No video provided" }, { status: 400 })
    }

    const { emotions, primaryEmotion, confidence, frames } = analyzeEmotionFromVideo(video)

    const analysis = {
      id: String(analyses.length + 1),
      userId,
      childName: userName,
      primaryEmotion,
      emotions,
      confidence,
      framesAnalyzed: frames,
      timestamp: new Date().toISOString(),
      videoSize: video.size,
      videoType: video.type,
      analysisMethod: "TensorFlow.js + Face-API",
    }

    analyses.push(analysis)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Emotion analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze emotion" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const parentId = request.nextUrl.searchParams.get("parentId")

    // For demo purposes, return all analyses
    // In production, filter by parent's children
    return NextResponse.json({ analyses })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analyses" }, { status: 500 })
  }
}
