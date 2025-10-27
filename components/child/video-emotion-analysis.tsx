"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Play, Pause } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import EmotionDetectorInfo from "./emotion-detector-info"

interface VideoEmotionAnalysisProps {
  userId: string
  userName: string
}

export default function VideoEmotionAnalysis({ userId, userName }: VideoEmotionAnalysisProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playbackRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string>("")

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      setError("")
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        setRecordedBlob(blob)
        const url = URL.createObjectURL(blob)
        setVideoUrl(url)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const togglePlayback = () => {
    if (playbackRef.current) {
      if (isPlaying) {
        playbackRef.current.pause()
      } else {
        playbackRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const analyzeEmotion = async () => {
    if (!recordedBlob) return

    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append("video", recordedBlob)
      formData.append("userId", userId)
      formData.append("userName", userName)

      const response = await fetch("/api/emotion-analysis", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setRecordedBlob(null)
      } else {
        setError(data.error || "Analysis failed")
      }
    } catch (err) {
      setError("Error analyzing video")
    } finally {
      setAnalyzing(false)
    }
  }

  const resetRecording = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
    setRecordedBlob(null)
    setResult(null)
    setError("")
    setVideoUrl("")
    setIsPlaying(false)
    setRecordingTime(0)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Video Emotion Analysis</CardTitle>
          <CardDescription>Record a short video (15-30 seconds) for emotion analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Analysis complete! Your parents can view the results.
              </AlertDescription>
            </Alert>
          )}

          {!recordedBlob && !result && (
            <div className="space-y-4">
              <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              </div>

              {isRecording && (
                <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold text-red-700">Recording: {formatTime(recordingTime)}</span>
                </div>
              )}

              <div className="flex gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} className="flex-1 bg-blue-500 hover:bg-blue-600">
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} className="flex-1 bg-red-500 hover:bg-red-600">
                    Stop Recording
                  </Button>
                )}
              </div>
            </div>
          )}

          {recordedBlob && !result && (
            <div className="space-y-4">
              <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center relative group">
                <video ref={playbackRef} src={videoUrl} className="w-full h-full object-cover" />
                <button
                  onClick={togglePlayback}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isPlaying ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white" />}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-blue-900 mb-1">Video recorded successfully!</p>
                <p className="text-xs text-blue-700">Duration: {formatTime(recordingTime)}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={analyzeEmotion}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={analyzing}
                >
                  {analyzing ? "Analyzing..." : "Analyze Emotion"}
                </Button>
                <Button onClick={resetRecording} variant="outline" className="flex-1 bg-transparent">
                  Retake
                </Button>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Emotion Analysis Results</h3>

                <div className="space-y-4">
                  {Object.entries(result.emotions || {})
                    .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                    .map(([emotion, confidence]: [string, any]) => (
                      <div key={emotion} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-medium text-gray-700">{emotion}</span>
                          <span className="text-sm font-bold text-gray-900">{(confidence * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={confidence * 100} className="h-2" />
                      </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Primary Emotion:</span>
                    <span className="font-semibold text-gray-900 capitalize">{result.primaryEmotion}</span>
                  </div>
                  {result.confidence && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <span className="font-semibold text-gray-900">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  {result.stability && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Emotion Stability:</span>
                      <span className="font-semibold text-gray-900">{(result.stability * 100).toFixed(1)}%</span>
                    </div>
                  )}
                  {result.framesAnalyzed && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Frames Analyzed:</span>
                      <span className="font-semibold text-gray-900">{result.framesAnalyzed}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">Analyzed on {new Date(result.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <Button onClick={resetRecording} className="w-full">
                Record Another Video
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <EmotionDetectorInfo />
    </div>
  )
}
