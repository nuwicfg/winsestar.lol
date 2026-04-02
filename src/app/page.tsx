'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, Shield, Zap, Globe } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black overflow-hidden relative">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-black text-black text-xl italic">W</div>
          <span className="font-black text-2xl tracking-tighter uppercase italic">winsestar<span className="text-yellow-500">.lol</span></span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/login" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">LOGIN</Link>
          <Link href="/register" className="bg-white text-black px-6 py-2 rounded-full font-black text-sm tracking-widest hover:bg-yellow-500 transition-all shadow-xl shadow-white/5">GET STARTED</Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32 relative z-10 text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="inline-block px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full mb-8 backdrop-blur-md"
        >
          <span className="text-yellow-500 font-bold text-xs tracking-widest uppercase">SOVEREIGN V7.5 PROTOCOL ACTIVE</span>
        </motion.div>

        <motion.h1 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.9]"
        >
          THE ULTIMATE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-700">PROFILE SYSTEM</span>
        </motion.h1>

        <motion.p 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="max-w-2xl mx-auto text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-12"
        >
          Create a premium, cinematic identity for your digital existence. Fully customizable, high-performance, and undeniably aesthetic.
        </motion.p>

        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register" className="w-full sm:w-auto bg-yellow-500 text-black px-12 py-5 rounded-2xl font-black text-xl tracking-tight hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-yellow-500/20">
            CLAIM YOUR USERNAME
          </Link>
          <Link href="/login" className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white px-12 py-5 rounded-2xl font-black text-xl tracking-tight hover:bg-zinc-800 transition-all">
            ACCESS TERMINAL
          </Link>
        </motion.div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
           {[
             { icon: Shield, title: "SECURE IDENTITY", desc: "Your configuration, your rules. Powered by Supabase RLS." },
             { icon: Zap, title: "SOVEREIGN ENGINE", desc: "Unmatched performance with our custom X-Vision V8 rendering." },
             { icon: Globe, title: "PUBLIC LINK", desc: "Your unique cinematic profile, accessible globally via your @username." }
           ].map((item, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.8 + (idx * 0.1) }}
               className="bg-zinc-900/30 border border-zinc-800/50 p-8 rounded-3xl"
             >
                <item.icon className="text-yellow-500 mb-4" size={32} />
                <h3 className="font-black text-lg mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm font-bold leading-relaxed">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between border-t border-zinc-900 gap-6">
         <p className="text-zinc-600 text-xs font-black uppercase tracking-widest">© 2026 winsestar.lol | ALL RIGHTS RESERVED</p>
         <div className="flex items-center space-x-6 text-zinc-600 text-xs font-bold">
            <a href="#" className="hover:text-yellow-500 transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">TERMS</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">SUPPORT</a>
         </div>
      </footer>
    </div>
  )
}
