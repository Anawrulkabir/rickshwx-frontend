import { NextRequest, NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'

export async function GET(
  request: NextRequest,
  { params }: { params: { phone: string } }
) {
  try {
    const phone = decodeURIComponent(params.phone)
    const driver = serverDataManager.getDriverByPhone(phone)
    
    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(driver)
  } catch (error) {
    console.error('Error fetching driver by phone:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 