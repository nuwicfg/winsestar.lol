/**
 * SOVEREIGN v7.5 "winsestar.lol" - ADAPTED ENGINE
 * @author: Antigravity / winse
 */

"use strict";

(function() {
    // --- CINEMATIC TRANSITION SYSTEM v8.0 ---
    // --- CRITICAL VISIBILITY & TRANSITION SYSTEM v8.6 ---
    // This system ensures the site NEVER stays black, even if scripts fail.
    
    window.animatePageOut = function(url) {
        const overlay = document.createElement('div');
        overlay.className = 'transition-glitch-overlay glitch-flash-active';
        document.body.appendChild(overlay);
        document.body.classList.add('page-exit');
        setTimeout(() => { window.location.href = url; }, 800);
    };

    window.animatePageIn = function() {
        // Initial state: hide flash overlay if it exists
        const overlays = document.querySelectorAll('.transition-glitch-overlay');
        overlays.forEach(o => o.remove());

        // Entrance animation
        document.body.classList.add('page-enter');
        
        // Force opacity and remove enter class in the next frame
        requestAnimationFrame(() => {
            document.body.classList.remove('page-enter');
            document.body.style.opacity = '1';
            document.body.style.visibility = 'visible';
        });

        // Entrance flash
        const flash = document.createElement('div');
        flash.className = 'transition-glitch-overlay glitch-flash-active';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 600);
    };

    function forceShowPage() {
        document.body.classList.remove('page-enter', 'page-exit');
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';
        document.body.style.display = 'grid';
        const overlays = document.querySelectorAll('.transition-glitch-overlay');
        overlays.forEach(o => o.remove());
        console.log("Visibility Fail-safe Triggered.");
    }

    // Immediate execution
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        window.animatePageIn();
    } else {
        document.addEventListener('DOMContentLoaded', window.animatePageIn);
    }
    
    // Hard fail-safes
    setTimeout(forceShowPage, 1200);
    window.addEventListener('load', forceShowPage);

    // Global Navigation Interceptor
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href')) {
            const url = link.getAttribute('href');
            if (url && url !== '#' && !url.startsWith('http') && !url.startsWith('mailto')) {
                e.preventDefault();
                window.animatePageOut(url);
                return;
            }
        }
        const infoBtn = e.target.closest('#infoBtn');
        if (infoBtn) {
            e.preventDefault();
            window.animatePageOut('info.html');
            return;
        }
    });

    function init() {
        // EMERGENCY VISIBILITY (Prevents black screen in Chrome/Opera)
        forceShowPage(); 

        try {
            if (!window.S_PROFILE_DATA) {
                window.S_PROFILE_DATA = {
                    username: "winsestar",
                    full_name: "WINSESTAR",
                    config: {
                        links: { discord: "1158363483256147978" },
                        features: { badges: [], typewriter: true }
                    }
                };
            }

            const profile = window.S_PROFILE_DATA;
            const config = profile.config || {};
            
            window.sState = {
                discordId: '1158363483256147978',
                siteTitle: profile.full_name || profile.username,
                bio: profile.bio || '',
                colors: config.colors || {},
                effects: config.effects || {},
                media: config.media || { bgMode: 'stars' },
                discord: config.discord || { sync: true },
                links: config.links || {},
                features: config.features || { badges: ['imperial-star'], typewriter: true, viewCounter: true }
            };

            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                incrementGlobalViews();
            }
            bootSovereign();
        } catch (err) {
            console.error("Init Error:", err);
            forceShowPage(); 
        }
    }

    async function incrementGlobalViews() {
        try {
            const res = await fetch('https://api.counterapi.dev/v1/winsestar_v12/profile/up');
            const data = await res.json();
            let count = (data.count || 0);
            const viewEl = document.getElementById('profileVersion');
            if (viewEl) {
                viewEl.innerHTML = `<i class="fa-solid fa-eye" style="margin-right: 5px;"></i> ${Number(count).toLocaleString()} Görüntülenme`;
            }
        } catch (e) {}
    }

    function bootSovereign() {
        try {
            applySovereignState(window.sState);
            setupStaticTilt();
            preloadAvatar();
            fetchTelemetry();
            setInterval(fetchTelemetry, 15000);
            setInterval(spawnShootingStar, 4000);
            setTimeout(forceShowPage, 100); // Success override
        } catch (e) {
            console.error("Boot Error:", e);
            forceShowPage();
        }
    }

    // --- SHOOTING STARS ENGINE v8.5 ---
    function spawnShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.left = Math.random() * window.innerWidth + 'px';
        star.style.top = Math.random() * window.innerHeight * 0.5 + 'px';
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 3000);
    }

    // --- REUSED CORE LOGIC FROM engine_v8.js ---
    function applySovereignState(s) {
        const root = document.documentElement;
        const c = s.colors || {};
        
        // Apply CSS Variables
        if (c.name) {
            root.style.setProperty('--text-start', c.name[0]);
            root.style.setProperty('--text-end', c.name[1]);
        }
        if (c.border) {
            root.style.setProperty('--border-start', c.border[0]);
            root.style.setProperty('--border-end', c.border[1]);
        }

        const eff = s.effects || {};
        const nameEl = document.getElementById('profileName');
        const cardEl = document.getElementById('mainCard');

        if (cardEl) {
            cardEl.classList.toggle('float-animation', !!eff.floatCard);
            cardEl.classList.toggle('glow-animation', !!eff.glowCard);
        }

        handleBgMatrix(s.media || { bgMode: 'stars' });
        renderSocialIcons(s.links || {});
        applyBadges(s.features?.badges || []);
        
        if (s.features?.typewriter) {
            const bioEl = document.getElementById('profileBio');
            if (bioEl) bioEl.innerHTML = s.bio;
        }
    }

    function handleBgMatrix(m) {
        const atom = document.getElementById('particles-js');
        if (!atom) return;
        
        if (window.particlesJS) {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 150 },
                    color: { value: m.atomColor || '#ffffff' },
                    opacity: { value: 0.5 },
                    size: { value: 1 },
                    line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.1, width: 1 },
                    move: { enable: true, speed: 2 }
                }
            });
        }
    }

    function renderSocialIcons(links) {
        const grid = document.getElementById('socialLinks');
        if (!grid) return;
        grid.innerHTML = '';
        
        const icons = { discord: 'fa-discord', tiktok: 'fa-tiktok', instagram: 'fa-instagram', github: 'fa-github', youtube: 'fa-youtube', steam: 'fa-steam', spotify: 'fa-spotify', twitter: 'fa-x-twitter', telegram: 'fa-telegram' };
        Object.keys(icons).forEach(k => {
            if (links[k]) {
                grid.innerHTML += `<a href="${links[k]}" target="_blank" class="social-item">
                    <i class="fa-brands ${icons[k]}"></i>
                </a>`;
            }
        });
    }

    function setupStaticTilt() {
        const card = document.getElementById('cardTilt');
        if (!card) return;
        window.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const centerX = r.left + r.width / 2;
            const centerY = r.top + r.height / 2;
            const rx = ((e.clientY - centerY) / (window.innerHeight / 2)) * -10;
            const ry = ((e.clientX - centerX) / (window.innerWidth / 2)) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`;
        });
    }

    async function fetchTelemetry() {
        const dId = window.sState.discordId;
        if (!dId) return;
        try {
            const r = await fetch('https://api.lanyard.rest/v1/users/' + dId);
            const { data } = await r.json();
            if (data) renderTelemetry(data);
        } catch (e) {}
    }

    function getAssetUrl(appId, assetId) {
        if (!assetId) return `https://dcdn.dstn.to/app-icons/${appId}`;
        if (assetId.startsWith('mp:external/')) {
            return 'https://media.discordapp.net/external/' + assetId.replace('mp:external/', '');
        }
        return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
    }

    function renderTelemetry(data) {
        const statusEl = document.getElementById('discordStatus');
        if (statusEl) {
            const colors = { online: '#22c55e', idle: '#f59e0b', dnd: '#ef4444', offline: '#4b5563' };
            statusEl.style.background = colors[data.discord_status] || colors.offline;
        }

        const prefsEl = document.getElementById('discordPrefs');
        if (prefsEl) {
            let html = '';
            
            const customStatus = data.activities.find(a => a.type === 4);
            if (customStatus) {
                const emoji = customStatus.emoji?.id ? `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}?size=32" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;">` : (customStatus.emoji?.name ? (customStatus.emoji.name + ' ') : '');
                const text = customStatus.state || '';
                html += `<div class="v8-pref-widget telemetry-card activity-card" style="border-left: 2px solid #ffffff;"><div class="pref-label" style="font-size: 0.7em; color: #fff; margin-bottom: 4px; text-transform: uppercase; font-weight: bold;"><i class="fa-solid fa-comment-dots" style="margin-right: 4px;"></i> STATUS</div><div class="pref-val" style="font-size: 0.9em; font-weight: 500; color: #fff;">${emoji}${text}</div></div>`;
            }
            
            if (data.spotify) {
                const cover = data.spotify.album_art_url || '';
                html += `<div class="v8-pref-widget telemetry-card spotify-card">
                            <img src="${cover}" class="ss-album-art">
                            <div class="ss-info">
                                <div class="ss-listening-tag"><i class="fa-brands fa-spotify"></i> LISTENING</div>
                                <div class="ss-title-wrap"><span class="ss-title ss-target-title">${data.spotify.song}</span></div>
                                <div class="ss-artist-wrap"><span class="ss-artist ss-target-artist">by ${data.spotify.artist}</span></div>
                            </div>
                        </div>`;
            }
            
            data.activities.filter(a => a.type === 0).forEach(game => {
                const imgUrl = game.application_id ? getAssetUrl(game.application_id, game.assets?.large_image) : 'logo.png';
                html += `<div class="v8-pref-widget telemetry-card activity-card">
                            <img src="${imgUrl}" class="ss-game-art">
                            <div class="ss-info">
                                <div class="ss-playing-tag"><i class="fa-solid fa-gamepad"></i> PLAYING</div>
                                <div class="ss-title-wrap"><span class="ss-title ss-target-title">${game.name}</span></div>
                                <div class="ss-artist-wrap"><span class="ss-artist ss-target-artist">${game.details || ''}</span></div>
                            </div>
                        </div>`;
            });
            
            if (!html) {
                html = `<div class="v8-pref-widget" style="padding: 10px; background: rgba(0,0,0,0.5); border-radius: 8px; text-align: center; border: 1px dashed rgba(255,255,255,0.3);"><div class="pref-label" style="font-size: 0.7em; color: rgba(255,255,255,0.7); margin-bottom: 4px; text-transform: uppercase;"><i class="fa-solid fa-satellite-dish" style="margin-right: 4px;"></i> DISCORD TELEMETRY</div><div class="pref-val"><span style="color: rgba(255,255,255,0.6); font-size: 0.85em;">Offline or Idle</span></div></div>`;
            }
            
            prefsEl.innerHTML = html;
        }

        // Sync 3D Side Decorations
        sync3DDecor(data);

        // Apply Marquee to internal card targets
        setTimeout(() => {
            const targets = document.querySelectorAll('.ss-target-title, .ss-target-artist');
            targets.forEach(t => handleMarquee(t));
        }, 100);
    }

    function sync3DDecor(data) {
        const coverEl = document.getElementById('decorCover');
        const decorWrap = document.getElementById('decorLeft');
        if (!coverEl || !decorWrap) return;

        if (data.spotify) {
            coverEl.src = data.spotify.album_art_url || 'logo.png';
            decorWrap.style.opacity = "0.25"; // Increased for Chrome rendering engine
            decorWrap.style.pointerEvents = "none";
        } else {
            // If not listening, you might want to hide it or show a default logo
            coverEl.src = 'logo.png';
            decorWrap.style.opacity = "0.1"; 
        }
    }

    function handleMarquee(el) {
        if (!el) return;
        el.classList.remove('ss-marquee');
        
        // Let the DOM settle, then check for actual overflow
        setTimeout(() => {
            const container = el.parentElement;
            // Case: If text is wider than its container, start scrolling
            if (el.scrollWidth > container.offsetWidth) {
                el.classList.add('ss-marquee');
                
                // Double the content internally to create a seamless loop
                if (!el.innerHTML.includes('</span><span')) {
                   const original = el.innerText;
                   el.innerHTML = `<span>${original}</span><span style="padding-left: 50px;">${original}</span>`;
                }
            }
        }, 300); // Increased delay for better measurement on initial render
    }

    function applyBadges(badges) {
        const wrap = document.getElementById('badgeContainer');
        if (!wrap || !badges.length) return;
        wrap.classList.remove('hidden');
        wrap.innerHTML = badges.map(b => `<div class="badge-item"><i class="fa-solid fa-certificate"></i></div>`).join('');
    }

    function preloadAvatar() {}

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
