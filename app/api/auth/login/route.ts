import { NextRequest, NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Try to find user (student)
    const student = serverDataManager.getStudentByEmail(email)
    if (student) {
      // Password check (mock)
      if (!password || password.length < 6) {
        return NextResponse.json(
          { message: 'Invalid password' },
          { status: 401 }
        )
      }
      const user = {
        id: student.id,
        email: student.email,
        phone: student.phone,
        name: student.name,
        type: 'user',
      }
      const token = jwt.sign({ userId: user.id, type: user.type }, JWT_SECRET, { expiresIn: '24h' })
      return NextResponse.json({
        message: 'Login successful',
        token,
        user
      })
    }

    // Try to find driver
    const allDrivers = serverDataManager.getAllDrivers()
    const driver = allDrivers.find(d => d.email === email)
    if (driver) {
      // Password check (mock)
      if (!password || password.length < 6) {
        return NextResponse.json(
          { message: 'Invalid password' },
          { status: 401 }
        )
      }
      const user = {
        id: driver.id,
        email: driver.email,
        phone: driver.phone,
        name: driver.name,
        type: 'driver',
        driver: {
          id: driver.id,
          vehicleType: driver.vehicleType,
          vehicleNumber: driver.vehicleNumber,
          status: driver.isOnline ? 'online' : 'offline',
        }
      }
      const token = jwt.sign({ userId: user.id, type: user.type }, JWT_SECRET, { expiresIn: '24h' })
      return NextResponse.json({
        message: 'Login successful',
        token,
        user
      })
    }

    return NextResponse.json(
      { message: 'User not found' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 