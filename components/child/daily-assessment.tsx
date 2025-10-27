"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"

interface DailyAssessmentProps {
  userId: string
  userName: string
}

export default function DailyAssessment({ userId, userName }: DailyAssessmentProps) {
  const [mood, setMood] = useState("")
  const [energy, setEnergy] = useState("")
  const [sleep, setSleep] = useState("")
  const [stress, setStress] = useState("")
  const [focus, setFocus] = useState("")
  const [social, setSocial] = useState("")
  const [appetite, setAppetite] = useState("")
  const [notes, setNotes] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          mood,
          energy,
          sleep,
          stress,
          focus,
          social,
          appetite,
          notes,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setMood("")
        setEnergy("")
        setSleep("")
        setStress("")
        setFocus("")
        setSocial("")
        setAppetite("")
        setNotes("")
        setTimeout(() => setSubmitted(false), 3000)
      }
    } catch (error) {
      console.error("Error submitting assessment:", error)
    } finally {
      setLoading(false)
    }
  }

  const allFieldsFilled = mood && energy && sleep && stress && focus && social && appetite

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
        <CardTitle className="text-2xl text-primary">Daily Check-in 🌟</CardTitle>
        <CardDescription className="text-base">How are you feeling today? Tell us everything!</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {submitted && (
          <Alert className="mb-4 bg-green-100 border-green-400 border-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <AlertDescription className="text-green-800 font-semibold">
              Awesome! Your check-in has been saved! Your parents can see this report. 🎉
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <Label className="text-base font-bold text-blue-900">How is your mood today? 😊</Label>
            <RadioGroup value={mood} onValueChange={setMood}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-happy" id="very-happy" />
                <Label htmlFor="very-happy" className="font-normal cursor-pointer">
                  Very Happy 😄
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="happy" id="happy" />
                <Label htmlFor="happy" className="font-normal cursor-pointer">
                  Happy 🙂
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral" id="neutral" />
                <Label htmlFor="neutral" className="font-normal cursor-pointer">
                  Neutral 😐
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sad" id="sad" />
                <Label htmlFor="sad" className="font-normal cursor-pointer">
                  Sad 😢
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-sad" id="very-sad" />
                <Label htmlFor="very-sad" className="font-normal cursor-pointer">
                  Very Sad 😭
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-200">
            <Label className="text-base font-bold text-yellow-900">Energy Level ⚡</Label>
            <RadioGroup value={energy} onValueChange={setEnergy}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-high" id="very-high" />
                <Label htmlFor="very-high" className="font-normal cursor-pointer">
                  Very High ⚡⚡
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal cursor-pointer">
                  High 💪
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal cursor-pointer">
                  Medium 👍
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-normal cursor-pointer">
                  Low 😴
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
            <Label className="text-base font-bold text-purple-900">How did you sleep last night? 🌙</Label>
            <RadioGroup value={sleep} onValueChange={setSleep}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent" className="font-normal cursor-pointer">
                  Excellent 😴
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good" className="font-normal cursor-pointer">
                  Good 🌙
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="okay" id="okay" />
                <Label htmlFor="okay" className="font-normal cursor-pointer">
                  Okay 😐
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor" className="font-normal cursor-pointer">
                  Poor 😞
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border-2 border-red-200">
            <Label className="text-base font-bold text-red-900">Stress Level 😰</Label>
            <RadioGroup value={stress} onValueChange={setStress}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-stress" id="no-stress" />
                <Label htmlFor="no-stress" className="font-normal cursor-pointer">
                  No Stress 😌
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low-stress" id="low-stress" />
                <Label htmlFor="low-stress" className="font-normal cursor-pointer">
                  Low Stress 🙂
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium-stress" id="medium-stress" />
                <Label htmlFor="medium-stress" className="font-normal cursor-pointer">
                  Medium Stress 😟
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high-stress" id="high-stress" />
                <Label htmlFor="high-stress" className="font-normal cursor-pointer">
                  High Stress 😰
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-200">
            <Label className="text-base font-bold text-green-900">Focus & Concentration 🧠</Label>
            <RadioGroup value={focus} onValueChange={setFocus}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent-focus" id="excellent-focus" />
                <Label htmlFor="excellent-focus" className="font-normal cursor-pointer">
                  Excellent 🎯
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good-focus" id="good-focus" />
                <Label htmlFor="good-focus" className="font-normal cursor-pointer">
                  Good 👀
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="okay-focus" id="okay-focus" />
                <Label htmlFor="okay-focus" className="font-normal cursor-pointer">
                  Okay 😐
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor-focus" id="poor-focus" />
                <Label htmlFor="poor-focus" className="font-normal cursor-pointer">
                  Poor 🤔
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border-2 border-pink-200">
            <Label className="text-base font-bold text-pink-900">Social Feelings 👥</Label>
            <RadioGroup value={social} onValueChange={setSocial}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-social" id="very-social" />
                <Label htmlFor="very-social" className="font-normal cursor-pointer">
                  Very Social 🎉
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="social" id="social" />
                <Label htmlFor="social" className="font-normal cursor-pointer">
                  Social 😊
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="neutral-social" id="neutral-social" />
                <Label htmlFor="neutral-social" className="font-normal cursor-pointer">
                  Neutral 😐
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="withdrawn" id="withdrawn" />
                <Label htmlFor="withdrawn" className="font-normal cursor-pointer">
                  Withdrawn 🤐
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
            <Label className="text-base font-bold text-orange-900">Appetite 🍎</Label>
            <RadioGroup value={appetite} onValueChange={setAppetite}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-hungry" id="very-hungry" />
                <Label htmlFor="very-hungry" className="font-normal cursor-pointer">
                  Very Hungry 😋
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hungry" id="hungry" />
                <Label htmlFor="hungry" className="font-normal cursor-pointer">
                  Hungry 🍽️
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal-appetite" id="normal-appetite" />
                <Label htmlFor="normal-appetite" className="font-normal cursor-pointer">
                  Normal 😐
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no-appetite" id="no-appetite" />
                <Label htmlFor="no-appetite" className="font-normal cursor-pointer">
                  No Appetite 😞
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3 p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border-2 border-indigo-200">
            <Label htmlFor="notes" className="text-base font-bold text-indigo-900">
              Anything you want to share? 💭
            </Label>
            <Textarea
              id="notes"
              placeholder="Tell us what's on your mind... (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24 border-2 border-indigo-300 focus:border-indigo-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-lg font-bold py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-lg border-2 border-primary/50"
            disabled={loading || !allFieldsFilled}
          >
            {loading ? "Saving..." : "Save Check-in 🎉"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
