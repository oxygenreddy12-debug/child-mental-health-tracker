import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users = [
  { id: "1", email: "ram@example.com", password: "password123", name: "Ram", role: "child", parentId: null },
  { id: "2", email: "lakshman@example.com", password: "password123", name: "Lakshman", role: "child", parentId: null },
  { id: "3", email: "dasarath@example.com", password: "password123", name: "Dasarath", role: "parent", parentId: null },
  { id: "4", email: "kousalya@example.com", password: "password123", name: "Kousalya", role: "parent", parentId: null },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create a simple token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
