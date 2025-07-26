import { NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'

export async function GET() {
  try {
    const students = serverDataManager.getAllStudents()
    const drivers = serverDataManager.getAllDrivers()
    
    return NextResponse.json({
      success: true,
      data: {
        students,
        drivers,
        totalStudents: students.length,
        totalDrivers: drivers.length
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 