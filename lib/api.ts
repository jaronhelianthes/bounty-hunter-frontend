// lib/api.ts

/**
 * Fetch bounties from the backend via Next.js proxy
 * @param userId - User ID from auth context
 * @param filters - Optional filter parameters
 * @returns Bounty response with metadata
 */
export async function fetchBounties(
  userId: string,
  filters?: BountyFilters
): Promise<BountyResponse> {
  const params = new URLSearchParams({ user_id: userId })
  
  if (filters?.min_score !== undefined) {
    params.append('min_score', filters.min_score.toString())
  }
  if (filters?.only_untouched !== undefined) {
    params.append('only_untouched', filters.only_untouched.toString())
  }
  if (filters?.limit !== undefined) {
    params.append('limit', filters.limit.toString())
  }
  
  const response = await fetch(`/api/bounties?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch bounties')
  }
  
  return response.json()
}

/**
 * Fetch a single bounty by ID via Next.js proxy
 * @param userId - User ID from auth context
 * @param bountyId - Bounty ID
 * @returns Single bounty object
 */
export async function fetchBountyById(
  userId: string,
  bountyId: string
): Promise<Bounty> {
  const response = await fetch(`/api/bounties/${bountyId}?user_id=${userId}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch bounty')
  }
  
  return response.json()
}

/**
 * Trigger manual poll for new bounties via Next.js proxy
 * @param userId - User ID from auth context
 * @returns Poll completion message
 */
export async function triggerPoll(userId: string): Promise<{ message: string; timestamp: string }> {
  const response = await fetch(`/api/bounties/poll?user_id=${userId}`, {
    method: 'POST',
  })
  
  if (!response.ok) {
    throw new Error('Failed to trigger poll')
  }
  
  return response.json()
}