"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

export default function DataSeeder() {
  const [seeded, setSeeded] = useState(false)
  const [message, setMessage] = useState("")

  const seedData = () => {
    setMessage("Sample data is already loaded in the API routes. The app is ready for testing!")
    setSeeded(true)
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle>Testing & Demo Data</CardTitle>
        <CardDescription>Load sample data for testing the application</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {seeded && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Demo Accounts:</h4>
          <div className="bg-white rounded-lg p-3 space-y-2 text-sm">
            <div>
              <p className="font-medium">Children:</p>
              <p className="text-gray-600">
                <strong>Ram:</strong> ram@example.com / password123
              </p>
              <p className="text-gray-600">
                <strong>Lakshman:</strong> lakshman@example.com / password123
              </p>
            </div>
            <div>
              <p className="font-medium">Parents:</p>
              <p className="text-gray-600">
                <strong>Dasarath:</strong> dasarath@example.com / password123
              </p>
              <p className="text-gray-600">
                <strong>Kousalya:</strong> kousalya@example.com / password123
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Sample Data Included:</h4>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>18 daily assessments across 2 children (14 days)</li>
            <li>12 emotion analysis results with confidence scores</li>
            <li>Realistic mood patterns and trends</li>
            <li>Varied energy levels and sleep quality</li>
            <li>Personal notes for context</li>
          </ul>
        </div>

        <Button onClick={seedData} className="w-full bg-blue-600 hover:bg-blue-700">
          Confirm Data Ready
        </Button>
      </CardContent>
    </Card>
  )
}
