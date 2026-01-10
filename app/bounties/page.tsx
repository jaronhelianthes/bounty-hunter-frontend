// app/bounties/page.tsx

'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { BountyRow } from '@/components/BountyRow'
import { FilterBar } from '@/components/FilterBar'
import { useState, useEffect } from 'react'
import { fetchBounties, triggerPoll } from '@/lib/api'
import { sortBountiesByPriority } from '@/lib/bountyUtils' // Add this line

export default function BountiesPage() {
  const { user, profile, logout, loading: authLoading } = useAuth()
  
  const [bounties, setBounties] = useState<Bounty[]>([])
  const [loading, setLoading] = useState(true)
  const [isPolling, setIsPolling] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  
  // Filter state
  const [minScore, setMinScore] = useState(0)
  const [onlyUntouched, setOnlyUntouched] = useState(false)

  // Fetch bounties function
  const loadBounties = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      const response = await fetchBounties(user.id, {
        min_score: minScore > 0 ? minScore : undefined,
        only_untouched: onlyUntouched,
        limit: 100,
      })
      
      // Sort by tier priority (Tier 1 first, then Tier 2, etc.)
      const sorted = sortBountiesByPriority(response.bounties)
      setBounties(sorted)
      setLastUpdated(response.last_updated)
    } catch (error) {
      console.error('Error fetching bounties:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle manual poll
  const handlePoll = async () => {
    if (!user?.id) return
    
    try {
      setIsPolling(true)
      await triggerPoll(user.id)
      // Reload bounties after polling
      await loadBounties()
    } catch (error) {
      console.error('Error polling bounties:', error)
    } finally {
      setIsPolling(false)
    }
  }

  // Initial load + trigger first poll
  useEffect(() => {
    if (user?.id) {
      const doInitialLoad = async () => {
        // First, load any existing bounties immediately (no loading state)
        await loadBounties()
        
        // Then poll in background for new bounties
        try {
          setIsPolling(true)
          await triggerPoll(user.id)
          // Reload to show new bounties (smooth update)
          await loadBounties()
        } catch (error) {
          console.error('Error on initial poll:', error)
        } finally {
          setIsPolling(false)
        }
      }
      
      doInitialLoad()
    }
  }, [user?.id])

  // Reload when filters change
  useEffect(() => {
    if (user?.id) {
      loadBounties()
    }
  }, [minScore, onlyUntouched])

  // Auto-refresh every 10 minutes
  useEffect(() => {
    if (!user?.id) return

    const interval = setInterval(() => {
      loadBounties()
    }, 10 * 60 * 1000) // 10 minutes

    return () => clearInterval(interval)
  }, [user?.id, minScore, onlyUntouched])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <p className="animate-pulse text-gray-400">Loading...</p>
      </div>
    )
  }

  // Show loading skeleton only on very first load (when we have no bounties yet)
  const isFirstLoad = loading && bounties.length === 0


  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">🎯 Bounty Hunter</h1>
            <p className="text-sm text-gray-400 mt-1">
              Welcome, {profile?.github_username || user?.email}
            </p>
          </div>
          <Button variant="outline" onClick={logout} className="border-white/10 text-gray-300 hover:bg-white/5">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        minScore={minScore}
        onMinScoreChange={setMinScore}
        onlyUntouched={onlyUntouched}
        onOnlyUntouchedChange={setOnlyUntouched}
        onPoll={handlePoll}
        isPolling={isPolling}
        lastUpdated={lastUpdated}
      />

      {/* Polling indicator banner */}
      {isPolling && bounties.length > 0 && (
        <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2">
          <p className="text-sm text-blue-400 text-center">
            🔍 Checking for new bounties...
          </p>
        </div>
      )}

      {/* Bounty List */}
      <div className="max-w-7xl mx-auto">
        {isFirstLoad ? (
          // Loading skeleton
          <div className="space-y-0">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="px-4 py-3 border-b border-white/5 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bounties.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No bounties found</h3>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              {minScore > 0 || onlyUntouched
                ? 'Try adjusting your filters or check for new bounties.'
                : 'No bounties available yet. Click "Check for New" to poll GitHub.'}
            </p>
            <Button
              onClick={handlePoll}
              disabled={isPolling}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              {isPolling ? 'Polling...' : 'Check for New Bounties'}
            </Button>
          </div>
        ) : (
          // Bounty rows
          <div className="divide-y divide-white/5">
            {bounties.map((bounty, index) => (
              <BountyRow key={bounty.id} bounty={bounty} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Footer stats */}
      {!loading && bounties.length > 0 && (
        <div className="border-t border-white/10 mt-8 py-4 px-6">
          <p className="text-sm text-gray-500 text-center">
            Showing {bounties.length} {bounties.length === 1 ? 'bounty' : 'bounties'}
            {minScore > 0 && ` with score ≥ ${minScore}`}
            {onlyUntouched && ' (untouched only)'}
          </p>
        </div>
      )}
    </div>
  )
}