import { NextRequest, NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'

export async function GET() {
  try {
    const drivers = serverDataManager.getAllDrivers()
    return NextResponse.json({
      success: true,
      drivers
    })
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, phone, vehicleReg } = body

    // Validate required fields
    if (!firstName || !lastName || !phone || !vehicleReg) {
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

      return NextResponse.json(newDriver)
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }
  } catch (error) {
    console.error('Error creating driver:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 