import { createClient } from '@/lib/supabase'
import ProfileCard from '@/components/ProfileCard'
import { notFound } from 'next/navigation'

interface UserPageProps {
  params: {
    username: string
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const supabase = createClient()
  const { username } = params

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !profile) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-black">
      <ProfileCard profile={profile} />
    </main>
  )
}
