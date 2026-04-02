'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

interface ProfileProps {
  profile: any
}

export default function ProfileCard({ profile }: ProfileProps) {
  const [mounted, setMounted] = useState(false)
  const config = profile.config || {}
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="sovereign-master h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* VIDEO BACKGROUND LAYER */}
      <div id="videoLayer" className="video-bg-v7 hidden">
        <div id="ytPlayer"></div>
        <video id="nativeVideo" loop muted playsInline></video>
      </div>

      {/* GALACTIC BG ENGINE */}
      <canvas id="bgCanvas" className="bg-v7 hidden"></canvas>
      <div id="particles-js" className="bg-v7"></div>
      <div className="vignette"></div>
      <div className="scanlines"></div>
      <div className="glow-matrix"></div>

      {/* MAIN PROFILE INTERFACE */}
      <div id="mainUI" className="main-container-v7 main-visible">
        <div className="tilt-wrapper" id="cardTilt" style={{ width: '100%', maxWidth: '560px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          
          <div id="card-aura-particles" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '150%', height: '160%', zIndex: -1, pointerEvents: 'none', opacity: 0.8, filter: 'blur(2px)' }}>
          </div>

          <div className="profile-card-v7 gradient-border" id="mainCard">
            <div id="starAura" className="star-aura"></div>

            <header className="card-header-v7">
              <div className="banner-area-v7" id="cardBanner" style={{ backgroundImage: profile.banner_url ? `url(${profile.banner_url})` : undefined }}></div>
              <div className="avatar-wrap-v7">
                <img src={profile.avatar_url || '/profil.gif'} id="profileAvatar" className="profile-img-v7" alt="Avatar" />
                <div className="status-indicator-v7" id="discordStatus"></div>
              </div>
            </header>

            <div className="card-body-v7">
              <div className="name-matrix-v7">
                <h2 id="profileName" className="gradient-text name-pulse" data-text={profile.full_name || profile.username}>{profile.full_name || profile.username}</h2>
                <span id="profileUsername">@{profile.username}</span>
                <div id="badgeContainer" className="badges-v7 hidden"></div>
              </div>

              <div className="bio-area-v7">
                <p id="profileBio">{profile.bio}</p>
              </div>

              <div id="presenceRoot" className="presence-container-v7 hidden"></div>

              <div id="discordPrefs" className="discord-prefs-v8">
                 <div className="v8-pref-widget">
                    <div className="pref-label"><i className="fa-solid fa-satellite-dish"></i> INITIALIZING...</div>
                    <div className="pref-val">Connecting to Sovereign Lanyard Engine...</div>
                </div>
              </div>

              <div className="social-grid-v7" id="socialLinks"></div>

              <div id="viewCounter" className="view-counter-v7 hidden">
                <i className="fa-solid fa-eye"></i> <span id="viewCountVal">0</span> views
              </div>
            </div>

            <footer className="card-footer-v7">
              <div className="footer-hud">
                <span className="f-tag">'winsestar.lol</span>
                <div className="info-btn-wrap">
                  <i className="fa-solid fa-circle-info info-icon-v7"></i>
                </div>
                <span className="f-code" id="profileVersion">v7.5</span>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <Script src="https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js" strategy="beforeInteractive" />
      <Script src="/engine_v8_adapter.js" strategy="afterInteractive" />
      
      {/* Inject profile data for the legacy engine to pick up */}
      <Script id="profile-data" strategy="beforeInteractive">
        {`window.S_PROFILE_DATA = ${JSON.stringify(profile)};`}
      </Script>
    </div>
  )
}
