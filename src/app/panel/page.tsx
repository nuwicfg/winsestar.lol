'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, User, Palette, Share2, Sparkles, Save, Eye } from 'lucide-react'

export default function Panel() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setProfile(data)
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)

    if (error) alert(error.message)
    else alert('SYSTEM STORAGE UPDATED')
    setSaving(false)
  }

  const updateConfig = (key: string, value: any) => {
    setProfile({
      ...profile,
      config: {
        ...profile.config,
        [key]: value
      }
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-yellow-500 font-black animate-pulse tracking-widest uppercase">Initializing Core...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans selection:bg-yellow-500 selection:text-black">
      {/* NAVBAR */}
      <nav className="max-w-6xl mx-auto flex items-center justify-between mb-12 bg-zinc-900/50 border border-zinc-800 p-4 rounded-3xl backdrop-blur-xl">
        <div className="flex items-center space-x-3 ml-2">
          <div className="w-10 h-10 bg-yellow-500 rounded-2xl flex items-center justify-center">
            <Sparkles className="text-black" size={20} />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tighter">WINSESTAR<span className="text-yellow-500">.LOL</span></h1>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Admin Terminal v7.5</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.open(`/u/${profile.username}`, '_blank')}
            className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl transition-all font-bold text-sm"
          >
            <Eye size={16} />
            <span className="hidden md:inline">PREVIEW SITE</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black px-4 py-2 rounded-xl transition-all font-bold text-sm group"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">DISCONNECT</span>
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: BASIC INFO */}
        <div className="space-y-8 h-fit">
          <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <User size={20} className="text-yellow-500" />
              <h2 className="font-black text-sm uppercase tracking-widest">Identity Root</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 mb-2 block text-zinc-600">Username Sector (Constant)</label>
                <div className="bg-black/60 border border-zinc-800 p-4 rounded-2xl text-zinc-500 font-bold opacity-50">@{profile.username}</div>
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 mb-2 block">Display Designation</label>
                <input
                  type="text"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full bg-black/60 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-yellow-500/50 transition-all font-bold"
                  placeholder="The Emperor"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 mb-2 block">Bio Protocol</label>
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="w-full bg-black/60 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-yellow-500/50 transition-all font-bold min-h-[100px] resize-none"
                  placeholder="System description..."
                />
              </div>
            </div>
          </section>

          <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <Share2 size={20} className="text-yellow-500" />
              <h2 className="font-black text-sm uppercase tracking-widest">Social Matrix</h2>
            </div>
            {['discord', 'instagram', 'github', 'spotify', 'tiktok'].map(platform => (
              <div key={platform} className="mb-4 last:mb-0">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 mb-2 block">{platform} Link</label>
                <input
                  type="text"
                  value={profile.config?.links?.[platform] || ''}
                  onChange={(e) => {
                    const links = { ...(profile.config?.links || {}), [platform]: e.target.value };
                    updateConfig('links', links);
                  }}
                  className="w-full bg-black/60 border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-yellow-500/50 transition-all font-bold text-xs"
                  placeholder={`https://${platform}.com/...`}
                />
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT COLUMN: VISUAL CONFIG */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-3xl">
            <div className="flex items-center space-x-3 mb-8">
              <Palette size={20} className="text-yellow-500" />
              <h2 className="font-black text-sm uppercase tracking-widest">Chrome Customization</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Color Picker Mockups for demo - would need a specialized color picker component */}
              <div className="p-6 bg-black/40 border border-zinc-800 rounded-3xl">
                <h3 className="text-xs font-black uppercase text-zinc-500 mb-6 tracking-tighter">Color Gradient: <span className="text-white">NAME</span></h3>
                <div className="flex space-x-4">
                  <input type="color" value={profile.config?.colors?.name?.[0] || '#facc15'} onChange={(e) => {
                    const colors = { ...(profile.config?.colors || {}), name: [e.target.value, profile.config?.colors?.name?.[1] || '#f59e0b'] };
                    updateConfig('colors', colors);
                  }} className="w-12 h-12 bg-transparent border-none cursor-pointer" />
                  <input type="color" value={profile.config?.colors?.name?.[1] || '#f59e0b'} onChange={(e) => {
                    const colors = { ...(profile.config?.colors || {}), name: [profile.config?.colors?.name?.[0] || '#facc15', e.target.value] };
                    updateConfig('colors', colors);
                  }} className="w-12 h-12 bg-transparent border-none cursor-pointer" />
                </div>
              </div>

              <div className="p-6 bg-black/40 border border-zinc-800 rounded-3xl">
                <h3 className="text-xs font-black uppercase text-zinc-500 mb-6 tracking-tighter">Color Gradient: <span className="text-white">BORDER</span></h3>
                <div className="flex space-x-4">
                  <input type="color" value={profile.config?.colors?.border?.[0] || '#facc15'} onChange={(e) => {
                    const colors = { ...(profile.config?.colors || {}), border: [e.target.value, profile.config?.colors?.border?.[1] || '#27272a'] };
                    updateConfig('colors', colors);
                  }} className="w-12 h-12 bg-transparent border-none cursor-pointer" />
                  <input type="color" value={profile.config?.colors?.border?.[1] || '#27272a'} onChange={(e) => {
                    const colors = { ...(profile.config?.colors || {}), border: [profile.config?.colors?.border?.[0] || '#facc15', e.target.value] };
                    updateConfig('colors', colors);
                  }} className="w-12 h-12 bg-transparent border-none cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-zinc-800">
              <div className="flex items-center space-x-3 mb-6">
                <Sparkles size={20} className="text-yellow-500" />
                <h2 className="font-black text-sm uppercase tracking-widest">Engine Effects</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['glitchName', 'floatCard', 'glowCard', 'tiltEnabled'].map(eff => (
                  <button
                    key={eff}
                    onClick={() => {
                      const effects = { ...(profile.config?.effects || {}), [eff]: !profile.config?.effects?.[eff] };
                      updateConfig('effects', effects);
                    }}
                    className={`p-4 rounded-2xl border transition-all font-black text-[10px] uppercase text-center ${profile.config?.effects?.[eff] ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-black/40 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                  >
                    {eff.replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-yellow-500 text-black py-6 rounded-3xl font-black text-xl flex items-center justify-center space-x-4 hover:bg-yellow-400 active:scale-95 transition-all shadow-2xl shadow-yellow-500/20"
            >
              <Save />
              <span>{saving ? 'SYNCRONIZING...' : 'COMMIT SYSTEM CHANGES'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
