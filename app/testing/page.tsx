"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DataSeeder from "@/components/testing/data-seeder"

export default function TestingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">MindCare Testing Dashboard</h1>
          <p className="text-gray-600">Complete testing guide and demo data management</p>
        </div>

        <DataSeeder />

        <Card>
          <CardHeader>
            <CardTitle>Testing Checklist</CardTitle>
            <CardDescription>Verify all features are working correctly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge className="bg-green-100 text-green-800 h-fit">✓</Badge>
                <div>
                  <p className="font-semibold text-sm">Authentication</p>
                  <p className="text-xs text-gray-600">Login with demo credentials for both children and parents</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-green-100 text-green-800 h-fit">✓</Badge>
                <div>
                  <p className="font-semibold text-sm">Child Dashboard</p>
                  <p className="text-xs text-gray-600">Daily assessments with mood, energy, and sleep tracking</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-green-100 text-green-800 h-fit">✓</Badge>
                <div>
                  <p className="font-semibold text-sm">Video Recording</p>
                  <p className="text-xs text-gray-600">Record and analyze videos with emotion detection</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-green-100 text-green-800 h-fit">✓</Badge>
                <div>
                  <p className="font-semibold text-sm">Parent Dashboard</p>
                  <p className="text-xs text-gray-600">View comprehensive reports and emotion analysis trends</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-green-100 text-green-800 h-fit">✓</Badge>
                <div>
                  <p className="font-semibold text-sm">Data Visualization</p>
                  <p className="text-xs text-gray-600">
                    Charts, graphs, and statistical analysis of mental health data
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-green-100 text-green-800 h-fit">✓</Badge>
                <div>
                  <p className="font-semibold text-sm">Alert System</p>
                  <p className="text-xs text-gray-600">Automatic alerts for concerning patterns in child data</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Badge className="bg-green-100 text-green-800 h-fit">✓</Badge>
                <div>
                  <p className="font-semibold text-sm">Export Functionality</p>
                  <p className="text-xs text-gray-600">Download reports as CSV for professional consultation</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Overview</CardTitle>
            <CardDescription>What's included in MindCare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">For Children</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Daily mood and wellness check-ins</li>
                  <li>• Video emotion analysis</li>
                  <li>• Personal notes and reflections</li>
                  <li>• Secure authentication</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">For Parents</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Comprehensive dashboard overview</li>
                  <li>• Trend analysis and reports</li>
                  <li>• Alert system for concerns</li>
                  <li>• Data export for professionals</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Start Guide</CardTitle>
            <CardDescription>Get started with MindCare</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold mb-1">1. Login as a Child</p>
              <p className="text-gray-600">Use Ram or Lakshman's credentials to access the child dashboard</p>
            </div>
            <div>
              <p className="font-semibold mb-1">2. Complete Daily Assessment</p>
              <p className="text-gray-600">Fill out mood, energy, and sleep information with optional notes</p>
            </div>
            <div>
              <p className="font-semibold mb-1">3. Record Video</p>
              <p className="text-gray-600">Record a short video for emotion analysis (15-30 seconds)</p>
            </div>
            <div>
              <p className="font-semibold mb-1">4. Login as Parent</p>
              <p className="text-gray-600">Use Dasarath or Kousalya's credentials to view reports</p>
            </div>
            <div>
              <p className="font-semibold mb-1">5. Review Dashboard</p>
              <p className="text-gray-600">Check trends, alerts, and export data as needed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
