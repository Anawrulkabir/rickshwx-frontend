import { NextRequest, NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email)
    const student = serverDataManager.getStudentByEmail(email)
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('Error fetching student by email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 