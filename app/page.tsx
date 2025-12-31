// app/page.tsx
import { redirect } from 'next/navigation'

export default function HomePage() {
  // Root page just redirects to bounties (middleware will handle auth check)
  redirect('/bounties')
}