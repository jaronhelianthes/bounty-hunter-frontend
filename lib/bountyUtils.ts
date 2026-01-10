// lib/bountyUtils.ts

import { formatDistanceToNow } from 'date-fns'

/**
 * Format price from cents to dollar string
 * @param cents - Price in cents (e.g., 50000 = $500)
 * @returns Formatted price string (e.g., "$500") or "N/A"
 */
export function formatPrice(cents: number | null): string {
  if (!cents) return 'N/A'
  return `$${(cents / 100).toFixed(0)}`
}

/**
 * Convert timestamp to relative time string
 * @param timestamp - ISO timestamp string
 * @returns Relative time (e.g., "2 hours ago")
 */
export function timeAgo(timestamp: string): string {
  try {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  } catch (error) {
    return 'unknown'
  }
}

/**
 * Get color class for score badge based on value
 * @param score - Score value (0-100)
 * @returns Tailwind color classes
 */
export function getScoreBadgeColor(score: number): string {
  if (score >= 70) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  if (score >= 40) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  return 'bg-red-500/10 text-red-400 border-red-500/20'
}

/**
 * Get status text and emoji for bounty
 * @param status - Bounty status from database
 * @returns Formatted status string with emoji
 */
export function getStatusText(status: 'untouched' | 'active'): string {
  if (status === 'untouched') {
    return '🆕 Untouched'
  }
  return '👥 Has attempts'
}

/**
 * Get status color class
 * @param status - Bounty status from database
 * @returns Tailwind color class
 */
export function getStatusColor(status: 'untouched' | 'active'): string {
  return status === 'untouched' ? 'text-emerald-400' : 'text-yellow-400'
}

/**
 * Check if bounty has Algora label (for 💎 badge)
 * Note: Backend already validated this, but we might add label info later
 * @param bounty - Bounty object
 * @returns True if this is an Algora bounty
 */
export function isAlgoraBounty(bounty: Bounty): boolean {
  // For now, Algora bounties typically have higher scores (backend gives +20)
  // We could also check a labels field if we add it to the schema later
  // This is a placeholder - backend detection is authoritative
  return bounty.score >= 70 && bounty.price !== null && bounty.price >= 50000
}

/**
 * Get tier badge color and styling
 * @param tier - Tier classification
 * @returns Tailwind color classes for badge
 */
export function getTierBadgeColor(tier: string | null): string {
  switch (tier) {
    case 'Tier 1':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    case 'Tier 2':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    case 'Tier 3':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    case 'Other':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/40'
  }
}

/**
 * Get short tier label for compact display
 * @param tier - Tier classification
 * @returns Short label (e.g., "T1", "T2")
 */
export function getTierLabel(tier: string | null): string {
  switch (tier) {
    case 'Tier 1':
      return 'T1'
    case 'Tier 2':
      return 'T2'
    case 'Tier 3':
      return 'T3'
    case 'Other':
      return 'Other'
    default:
      return '?'
  }
}

/**
 * Get tier priority for sorting (lower = higher priority)
 * @param tier - Tier classification
 * @returns Priority number
 */
export function getTierPriority(tier: string | null): number {
  switch (tier) {
    case 'Tier 1':
      return 1
    case 'Tier 2':
      return 2
    case 'Tier 3':
      return 3
    case 'Other':
      return 4
    default:
      return 5
  }
}

/**
 * Sort bounties by tier priority, then score, then price
 * @param bounties - Array of bounties
 * @returns Sorted array
 */
export function sortBountiesByPriority(bounties: Bounty[]): Bounty[] {
  return [...bounties].sort((a, b) => {
    // First: Sort by tier (Tier 1 > Tier 2 > Tier 3 > Other)
    const tierDiff = getTierPriority(a.tier) - getTierPriority(b.tier)
    if (tierDiff !== 0) return tierDiff
    
    // Second: Sort by score (higher is better)
    const scoreDiff = (b.score || 0) - (a.score || 0)
    if (scoreDiff !== 0) return scoreDiff
    
    // Third: Sort by price (higher is better)
    const priceDiff = (b.price || 0) - (a.price || 0)
    return priceDiff
  })
}