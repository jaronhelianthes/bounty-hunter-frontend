// components/BountyRow.tsx

'use client'

import { ExternalLink } from 'lucide-react'
import { 
  formatPrice, 
  timeAgo, 
  getScoreBadgeColor, 
  getStatusText, 
  getStatusColor, 
  getTierBadgeColor, 
  getTierLabel 
} from '@/lib/bountyUtils'
import { cn } from '@/lib/utils'

interface BountyRowProps {
  bounty: Bounty
  index?: number
}

export function BountyRow({ bounty, index = 0 }: BountyRowProps) {
  const handleClick = () => {
    window.open(bounty.url, '_blank', 'noopener,noreferrer')
  }

  // Generate avatar letter from repo name
  const avatarLetter = bounty.repo_name.charAt(0).toUpperCase()
  
  // Check if Algora bounty (scores >= 70 with price >= $500 is a good heuristic)
  const isAlgora = bounty.score >= 70 && bounty.price !== null && bounty.price >= 50000

  return (
    <div
      onClick={handleClick}
      className={cn(
        'group flex items-center gap-4 px-4 py-3 cursor-pointer transition-all duration-200',
        'hover:bg-white/5 border-b border-white/5',
        'animate-in fade-in-50 slide-in-from-left-4'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
          {avatarLetter}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        {/* Tier badge */}
        <span className={cn(
          'px-2 py-0.5 rounded text-xs font-bold border whitespace-nowrap',
          getTierBadgeColor(bounty.tier)
        )} title={bounty.tier_reason || bounty.tier || 'Unknown tier'}>
          {getTierLabel(bounty.tier)}
        </span>

        {/* Repo name */}
        <span className="text-gray-400 text-sm font-medium whitespace-nowrap">
          {bounty.repo_owner}/{bounty.repo_name}
        </span>

        {/* Issue number */}
        <span className="text-gray-500 text-xs font-mono whitespace-nowrap">
          #{bounty.issue_number}
        </span>

        {/* Price */}
        <span className={cn(
          'text-sm font-semibold whitespace-nowrap',
          bounty.price ? 'text-emerald-400' : 'text-gray-600'
        )}>
          {formatPrice(bounty.price)}
        </span>

        {/* Score badge */}
        <span className={cn(
          'px-2 py-0.5 rounded text-xs font-medium border whitespace-nowrap',
          getScoreBadgeColor(bounty.score)
        )}>
          {bounty.score}
        </span>

        {/* Metadata badges - only show if non-zero */}
        {bounty.metadata && (
          <>
            {/* Assignees */}
            {bounty.metadata.num_assignees > 0 && (
              <span className="text-xs text-amber-400 whitespace-nowrap" title={`${bounty.metadata.num_assignees} assignee(s)`}>
                👥 {bounty.metadata.num_assignees}
              </span>
            )}
            
            {/* Attempts */}
            {bounty.metadata.num_attempt_comments > 0 && (
              <span className="text-xs text-blue-400 whitespace-nowrap" title={`${bounty.metadata.num_attempt_comments} attempt comment(s)`}>
                💬 {bounty.metadata.num_attempt_comments}
              </span>
            )}
            
            {/* Open PR indicator */}
            {bounty.metadata.has_open_pr && (
              <span className="text-xs text-purple-400 whitespace-nowrap" title="Has open PR">
                🔀 PR
              </span>
            )}
          </>
        )}

        {/* Algora diamond */}
        {isAlgora && (
          <span className="text-lg" title="Algora Bounty">
            💎
          </span>
        )}

        {/* Title */}
        <span className="text-white text-sm truncate flex-1 min-w-0 group-hover:text-blue-400 transition-colors">
          {bounty.title}
        </span>

        {/* External link icon (shows on hover) */}
        <ExternalLink className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
      </div>

      {/* Right side: Status + Time */}
      <div className="flex-shrink-0 text-right">
        <div className={cn('text-xs font-medium', getStatusColor(bounty.status))}>
          {getStatusText(bounty.status)}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">
          {timeAgo(bounty.posted_at)}
        </div>
      </div>
    </div>
  )
}