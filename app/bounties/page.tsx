// app/bounties/page.tsx
'use client'

import { useAuth } from '@/context/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BountiesPage() {
  const { user, profile, logout, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bounty Hunter</h1>
            <p className="text-muted-foreground">
              Welcome, {profile?.github_username || user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>

        <Card className="animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle>Fresh Bounties</CardTitle>
            <CardDescription>
              Bounties will appear here once we build the polling system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              User ID: <code className="rounded bg-slate-100 px-2 py-1">{user?.id}</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}