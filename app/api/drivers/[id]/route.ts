import { NextRequest, NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const driver = serverDataManager.getDriver(params.id)
    
    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(driver)
  } catch (error) {
    console.error('Error fetching driver:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 