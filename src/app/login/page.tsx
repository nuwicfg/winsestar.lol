'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/panel')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-zinc-900/60 border border-zinc-800 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-1">WELCOME <span className="text-yellow-500">BACK</span></h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-black">winsestar.lol system core</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black ml-2">AUTHENTICATION EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/80 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500/50 transition-all focus:ring-4 focus:ring-yellow-500/5 placeholder:text-zinc-700"
              placeholder="operator@winsestar.lol"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black ml-2">ACCESS PASSWORD</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/80 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-yellow-500/50 transition-all focus:ring-4 focus:ring-yellow-500/5 placeholder:text-zinc-700"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-xs text-center font-bold bg-red-500/5 py-3 rounded-xl border border-red-500/10"
            >
              ACCESS DENIED: {error}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-yellow-500 transition-all active:scale-95 disabled:opacity-50 mt-4 group"
          >
            {loading ? 'AUTHORIZING...' : 'BYPASS FIREWALL'}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-xs mt-10 font-bold">
           MISSING IDENTITY? <Link href="/register" className="text-yellow-500 hover:underline underline-offset-4 decoration-yellow-500/50">CREATE NEW SECTOR</Link>
        </p>
      </motion.div>
    </div>
  )
}
