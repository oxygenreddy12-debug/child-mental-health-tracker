"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Upload, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ImageEmotionAnalysisProps {
  userId: string
  userName: string
}

export default function ImageEmotionAnalysis({ userId, userName }: ImageEmotionAnalysisProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setSelectedImage(file)
    setError("")

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const analyzeEmotion = async () => {
    if (!selectedImage) return

    setAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("userId", userId)
      formData.append("userName", userName)

      const response = await fetch("/api/emotion-analysis/image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setSelectedImage(null)
        setPreviewUrl("")
      } else {
        setError(data.error || "Analysis failed")
      }
    } catch (err) {
      setError("Error analyzing image")
    } finally {
      setAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setPreviewUrl("")
    setResult(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Emotion Analysis from Photo</CardTitle>
          <CardDescription>Upload a photo of your face to analyze your current emotion</CardDescription>
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

          {!selectedImage && !result && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                <p className="text-sm font-semibold text-gray-700 mb-1">Click to upload a photo</p>
                <p className="text-xs text-gray-500">or drag and drop</p>
                <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 5MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </div>
          )}

          {selectedImage && !result && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                <img src={previewUrl || "/placeholder.svg"} alt="Selected" className="w-full h-full object-cover" />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm font-semibold text-blue-900 mb-1">Image selected</p>
                <p className="text-xs text-blue-700">{selectedImage.name}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={analyzeEmotion}
                  className="flex-1 bg-green-500 hover:bg-green-600"
                  disabled={analyzing}
                >
                  {analyzing ? "Analyzing..." : "Analyze Emotion"}
                </Button>
                <Button onClick={resetAnalysis} variant="outline" className="flex-1 bg-transparent">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
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
                  <p className="text-xs text-gray-500">Analyzed on {new Date(result.timestamp).toLocaleString()}</p>
                </div>
              </div>

              <Button onClick={resetAnalysis} className="w-full">
                Analyze Another Photo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
