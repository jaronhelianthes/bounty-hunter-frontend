// app/auth/callback/route.ts
import { createClient } from '@/lib/supabaseRouteHandler'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(new URL('/auth?error=' + error, request.url))
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Session exchange error:', exchangeError)
      return NextResponse.redirect(new URL('/auth?error=session_exchange_failed', request.url))
    }
  }

  // Redirect to bounties after successful auth
  return NextResponse.redirect(new URL('/bounties', request.url))
}