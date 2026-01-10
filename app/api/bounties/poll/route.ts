// app/api/bounties/poll/route.ts

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Missing user_id parameter' },
        { status: 400 }
      )
    }

    const url = `${BACKEND_URL}/api/bounties/poll?user_id=${userId}`

    const backendResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!backendResponse.ok) {
      const error = await backendResponse.json()
      return NextResponse.json(error, { status: backendResponse.status })
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error('Error polling bounties from backend:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}