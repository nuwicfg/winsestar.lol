'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // 1. Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(),
          full_name: username,
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (authData?.user) {
      router.push('/panel')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-yellow-500 mb-2">winsestar.lol</h1>
          <p className="text-zinc-500 text-sm italic tracking-widest uppercase font-bold">SOVEREIGN SYSTEM REGISTRY</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold ml-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-all focus:ring-1 focus:ring-yellow-500/20 shadow-inner"
              placeholder="winsestar"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold ml-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-all focus:ring-1 focus:ring-yellow-500/20 shadow-inner"
              placeholder="hello@winsestar.lol"
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2 font-bold ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-all focus:ring-1 focus:ring-yellow-500/20 shadow-inner"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black text-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-yellow-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'INITIALIZING...' : 'BEGIN REGISTRY'}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-2 mt-8">
            <div className="h-px bg-zinc-800 w-full"></div>
            <p className="text-zinc-500 text-xs whitespace-nowrap px-2 font-bold uppercase tracking-tighter">Identity Exists?</p>
            <div className="h-px bg-zinc-800 w-full"></div>
        </div>

        <p className="text-center text-zinc-400 text-sm mt-4 font-bold">
           <Link href="/login" className="text-yellow-500 hover:text-yellow-400 underline decoration-yellow-500/30 underline-offset-4">LOGIN TO SYSTEM</Link>
        </p>
      </motion.div>
    </div>
  )
}
