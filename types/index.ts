export interface Bounty {
  id: string
  title: string
  repo_owner: string
  repo_name: string
  issue_number: number
  url: string
  price: number | null
  description: string
  score: number
  posted_at: string
  age_hours: number
  status: string
}
