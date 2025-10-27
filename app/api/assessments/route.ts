import { type NextRequest, NextResponse } from "next/server"

const assessments: any[] = [
  // Ram's assessments (last 14 days)
  {
    id: "1",
    userId: "1",
    childName: "Ram",
    mood: "happy",
    energy: "high",
    sleep: "good",
    notes: "Had a great day at school today!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "1",
    childName: "Ram",
    mood: "neutral",
    energy: "medium",
    sleep: "okay",
    notes: "Feeling a bit tired today",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    userId: "1",
    childName: "Ram",
    mood: "happy",
    energy: "high",
    sleep: "good",
    notes: "Played soccer with friends",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    userId: "1",
    childName: "Ram",
    mood: "very-happy",
    energy: "very-high",
    sleep: "good",
    notes: "Got an A on my math test!",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    userId: "1",
    childName: "Ram",
    mood: "neutral",
    energy: "medium",
    sleep: "okay",
    notes: "Regular day at school",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    userId: "1",
    childName: "Ram",
    mood: "happy",
    energy: "high",
    sleep: "good",
    notes: "Watched my favorite movie",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    userId: "1",
    childName: "Ram",
    mood: "sad",
    energy: "low",
    sleep: "poor",
    notes: "Had an argument with a friend",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "8",
    userId: "1",
    childName: "Ram",
    mood: "neutral",
    energy: "medium",
    sleep: "okay",
    notes: "Feeling better today",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "9",
    userId: "1",
    childName: "Ram",
    mood: "happy",
    energy: "high",
    sleep: "good",
    notes: "Went to the park",
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "10",
    userId: "1",
    childName: "Ram",
    mood: "very-happy",
    energy: "very-high",
    sleep: "good",
    notes: "Birthday party was amazing!",
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // Lakshman's assessments (last 14 days)
  {
    id: "11",
    userId: "2",
    childName: "Lakshman",
    mood: "neutral",
    energy: "medium",
    sleep: "okay",
    notes: "Studying for exams",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "12",
    userId: "2",
    childName: "Lakshman",
    mood: "happy",
    energy: "high",
    sleep: "good",
    notes: "Finished my project",
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "13",
    userId: "2",
    childName: "Lakshman",
    mood: "neutral",
    energy: "medium",
    sleep: "okay",
    notes: "Regular school day",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "14",
    userId: "2",
    childName: "Lakshman",
    mood: "happy",
    energy: "high",
    sleep: "good",
    notes: "Played video games with friends",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "15",
    userId: "2",
    childName: "Lakshman",
    mood: "sad",
    energy: "low",
    sleep: "poor",
    notes: "Feeling stressed about exams",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "16",
    userId: "2",
    childName: "Lakshman",
    mood: "neutral",
    energy: "medium",
    sleep: "okay",
    notes: "Took a break from studying",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "17",
    userId: "2",
    childName: "Lakshman",
    mood: "happy",
    energy: "high",
    sleep: "good",
    notes: "Went hiking with family",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "18",
    userId: "2",
    childName: "Lakshman",
    mood: "very-happy",
    energy: "very-high",
    sleep: "good",
    notes: "Passed my exam!",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const assessment = {
      id: String(assessments.length + 1),
      userId: body.userId,
      childName: body.userName,
      mood: body.mood,
      energy: body.energy,
      sleep: body.sleep,
      notes: body.notes,
      timestamp: body.timestamp,
    }

    assessments.push(assessment)

    return NextResponse.json({ success: true, assessment })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const parentId = request.nextUrl.searchParams.get("parentId")

    // For demo purposes, return all assessments
    // In production, filter by parent's children
    return NextResponse.json({ assessments })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
  }
}
