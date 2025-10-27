"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Zap } from "lucide-react"

export default function EmotionDetectorInfo() {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          AI-Powered Emotion Detection
        </CardTitle>
        <CardDescription>How your video is analyzed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex gap-3">
            <Badge className="bg-blue-100 text-blue-800 h-fit">1</Badge>
            <div>
              <p className="font-semibold text-sm">Face Detection</p>
              <p className="text-xs text-gray-600">Your face is detected in each video frame</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Badge className="bg-blue-100 text-blue-800 h-fit">2</Badge>
            <div>
              <p className="font-semibold text-sm">Emotion Classification</p>
              <p className="text-xs text-gray-600">AI analyzes facial expressions for 7 emotions</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Badge className="bg-blue-100 text-blue-800 h-fit">3</Badge>
            <div>
              <p className="font-semibold text-sm">Aggregation</p>
              <p className="text-xs text-gray-600">Results are combined across all frames</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Badge className="bg-blue-100 text-blue-800 h-fit">4</Badge>
            <div>
              <p className="font-semibold text-sm">Privacy</p>
              <p className="text-xs text-gray-600">Video is processed and not stored</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 border border-blue-200 flex gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700">
            <strong>Tip:</strong> For best results, ensure good lighting and keep your face visible throughout the
            recording.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
