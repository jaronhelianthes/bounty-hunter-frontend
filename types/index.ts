// types/index.d.ts

// Bounty type matching backend schema
declare interface Bounty {
  id: string
  user_id: string
  title: string
  repo_owner: string
  repo_name: string
  issue_number: number
  url: string
  price: number | null // Price in cents (e.g., 50000 = $500)
  description: string | null
  score: number // 0-100
  status: 'untouched' | 'active'
  posted_at: string // ISO timestamp
  created_at: string // ISO timestamp
  tier: string | null // "Tier 1", "Tier 2", "Tier 3", or "Other"
  tier_reason: string | null // Explanation for tier classification
  metadata: BountyMetadata | null
}

// Metadata structure from detector.get_bounty_metadata()
declare interface BountyMetadata {
  num_assignees: number
  assignees: string[]
  num_attempt_comments: number
  most_recent_attempt_days_ago: number | null
  num_linked_prs: number
  has_open_pr: boolean
  most_recent_assignee_days_ago: number | null
  has_rewarded_label: boolean
  age_days: number | null
}

// API response structure from backend
declare interface BountyResponse {
  bounties: Bounty[]
  count: number
  last_updated: string
  filters_applied: {
    min_score: number | null
    only_untouched: boolean
    limit: number
  }
}

// Filter options for fetching bounties
declare interface BountyFilters {
  min_score?: number
  only_untouched?: boolean
  limit?: number
}