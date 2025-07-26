import { NextRequest, NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { isOnline } = body

    if (typeof isOnline !== 'boolean') {
      return NextResponse.json(
        { error: 'isOnline must be a boolean' },
        { status: 400 }
      )
    }

    const success = serverDataManager.updateDriverStatus(params.id, isOnline)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating driver status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 