import { NextResponse } from 'next/server'
import { serverDataManager } from '@/lib/server-data-manager'

export async function GET() {
  try {
    const data = serverDataManager.getData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 