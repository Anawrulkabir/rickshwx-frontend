import { NextRequest, NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'

export async function GET() {
  try {
    const students = serverDataManager.getAllStudents()
    return NextResponse.json({
      success: true,
      students
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, studentId, email, phone } = body

    // Validate required fields
    if (!firstName || !lastName || !studentId || !email || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!email.endsWith('@student.cuet.ac.bd')) {
      return NextResponse.json(
        { error: 'Please use your CUET student email address' },
        { status: 400 }
      )
    }

    // Validate student ID format
    if (!/^\d{7}$/.test(studentId)) {
      return NextResponse.json(
        { error: 'Student ID must be 7 digits' },
        { status: 400 }
      )
    }

    try {
      const newStudent = serverDataManager.addStudent({
        name: `${firstName} ${lastName}`,
        email,
        studentId,
        phone,
        avatar: "/placeholder.svg?height=40&width=40"
      })

      return NextResponse.json(newStudent)
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 