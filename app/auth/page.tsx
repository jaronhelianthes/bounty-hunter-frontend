// app/auth/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { useAuth } from '@/context/AuthContext'

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()
  const { user, loading } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/bounties')
    }
  }, [user, loading, router])

  const signInWithGitHub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) {
      console.error('Error signing in:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse animate-in fade-in duration-300">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Card className="w-[400px] animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Bounty Hunter</CardTitle>
          <CardDescription>
            Sign in with your GitHub account to start finding untouched bounties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={signInWithGitHub}
            className="w-full group hover:animate-pulse"
            size="lg"
          >
            <GitHubLogoIcon className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}