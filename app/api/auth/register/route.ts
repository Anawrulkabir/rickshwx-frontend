import { NextRequest, NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, ...userData } = body

    if (role === 'student') {
      const { firstName, lastName, studentId, email, phone, password } = userData
      
      // Validate required fields
      if (!firstName || !lastName || !studentId || !email || !phone || !password) {
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

        return NextResponse.json({
          success: true,
          message: 'Student account created successfully',
          user: {
            id: newStudent.id,
            name: newStudent.name,
            email: newStudent.email,
            studentId: newStudent.studentId
          }
        })
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
    }

    if (role === 'driver' || role === 'rickshaw') {
      const { firstName, lastName, phone, nid, license, vehicleReg, password } = userData
      
      // Validate required fields
      if (!firstName || !lastName || !phone || !nid || !license || !vehicleReg || !password) {
        return NextResponse.json(
          { error: 'All fields are required' },
          { status: 400 }
        )
      }

      // Validate phone number format
      if (!/^\+880\s\d{10}$/.test(phone)) {
        return NextResponse.json(
          { error: 'Please enter a valid Bangladeshi phone number (+880 1XXXXXXXXX)' },
          { status: 400 }
        )
      }

      try {
        const newDriver = serverDataManager.addDriver({
          name: `${firstName} ${lastName}`,
          phone,
          avatar: "/placeholder.svg?height=40&width=40",
          vehicleType: "Auto Rickshaw",
          vehicleNumber: vehicleReg
        })

        return NextResponse.json({
          success: true,
          message: 'Driver account created successfully. Please wait for verification.',
          user: {
            id: newDriver.id,
            name: newDriver.name,
            phone: newDriver.phone,
            vehicleNumber: newDriver.vehicleNumber
          }
        })
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Invalid role specified' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 