// components/FilterBar.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { timeAgo } from '@/lib/bountyUtils'

interface FilterBarProps {
  minScore: number
  onMinScoreChange: (score: number) => void
  onlyUntouched: boolean
  onOnlyUntouchedChange: (value: boolean) => void
  onPoll: () => void
  isPolling: boolean
  lastUpdated: string | null
}

export function FilterBar({
  minScore,
  onMinScoreChange,
  onlyUntouched,
  onOnlyUntouchedChange,
  onPoll,
  isPolling,
  lastUpdated,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-white/10 bg-white/5">
      {/* Min Score Filter */}
      <div className="flex items-center gap-2">
        <label htmlFor="min-score" className="text-sm text-gray-400 whitespace-nowrap">
          Min Score:
        </label>
        <Input
          id="min-score"
          type="number"
          min="0"
          max="100"
          value={minScore}
          onChange={(e) => onMinScoreChange(Number(e.target.value))}
          className="w-20 h-8 bg-white/5 border-white/10 text-white text-sm"
        />
      </div>

      {/* Untouched Only Toggle */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={onlyUntouched}
          onChange={(e) => onOnlyUntouchedChange(e.target.checked)}
          className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
        />
        <span className="text-sm text-gray-400">Untouched only</span>
      </label>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Last Updated */}
      {lastUpdated && (
        <span className="text-xs text-gray-500">
          Updated {timeAgo(lastUpdated)}
        </span>
      )}

      {/* Poll Button */}
      <Button
        onClick={onPoll}
        disabled={isPolling}
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-500 text-white"
      >
        <RefreshCw className={cn('w-4 h-4 mr-2', isPolling && 'animate-spin')} />
        {isPolling ? 'Polling...' : 'Check for New'}
      </Button>
    </div>
  )
}