/**
 * SOVEREIGN v7.5 "winsestar.lol" - ADAPTED ENGINE
 * @author: Antigravity / winse
 */

"use strict";

(function() {
    // Wait for profile data to be available
    function init() {
        if (!window.S_PROFILE_DATA) {
            setTimeout(init, 100);
            return;
        }

        const profile = window.S_PROFILE_DATA;
        const config = profile.config || {};
        
        // Map profile data to sState structure expected by the engine
        window.sState = {
            discordId: config.links?.discord?.split('/').pop() || '',
            siteTitle: profile.full_name || profile.username,
            bio: profile.bio || '',
            colors: config.colors || {},
            effects: config.effects || {},
            media: config.media || { bgMode: 'stars' },
            discord: config.discord || { sync: true },
            links: config.links || {},
            features: config.features || { badges: ['imperial-star'], typewriter: true, viewCounter: true }
        };

        incrementGlobalViews();
        bootSovereign();
    }

    async function incrementGlobalViews() {
        try {
            // Increment
            const res = await fetch('https://api.counterapi.dev/v1/winsestar/profile/up');
            const data = await res.json();
            let count = (data.count || 0) + 12842; // Base view count + actual visits
            
            const viewEl = document.getElementById('profileVersion');
            if (viewEl) {
                viewEl.innerHTML = `<i class="fa-solid fa-eye" style="margin-right: 5px;"></i> ${Number(count).toLocaleString()} Görüntülenme`;
            }
        } catch (e) {
            console.error("View Counter Error:", e);
        }
    }

    async function bootSovereign() {
        try {
            applySovereignState(window.sState);
            setupStaticTilt();
            preloadAvatar();
            fetchTelemetry();
            setInterval(fetchTelemetry, 15000);
        } catch (e) {
            console.error("Sovereign Engine Error:", e);
        }
    }

    // --- REUSED CORE LOGIC FROM engine_v8.js ---
    // (Stripped down version for cleaner execution in Next.js)

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
        // ... more color mapping ...

        const eff = s.effects || {};
        const nameEl = document.getElementById('profileName');
        const cardEl = document.getElementById('mainCard');

        if (nameEl) {
            // nameEl.classList.toggle('active-glitch', false);
        }
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
        
        // Simple star background by default
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

    // --- TELEMETRY HELPER ---
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

    function getDiscordBadgesHtml(flags) {
        if (!flags) return '';
        const badgeMap = {
            1: { name: 'Staff', icon: 'fa-discord', color: '#5865F2' },
            2: { name: 'Partner', icon: 'fa-handshake', color: '#5865F2' },
            4: { name: 'HypeSquad Events', icon: 'fa-flag', color: '#f59e0b' },
            8: { name: 'Bug Hunter', icon: 'fa-bug', color: '#22c55e' },
            64: { name: 'Bravery', icon: 'fa-shield', color: '#9b59b6' },
            128: { name: 'Brilliance', icon: 'fa-lightbulb', color: '#f1c40f' },
            256: { name: 'Balance', icon: 'fa-scale-balanced', color: '#1abc9c' },
            512: { name: 'Early Supporter', icon: 'fa-star', color: '#ffffff' },
            16384: { name: 'Bug Hunter Lvl 2', icon: 'fa-bug', color: '#f59e0b' },
            4194304: { name: 'Active Developer', icon: 'fa-code', color: '#22c55e' }
        };
        let html = '';
        for (const [bit, info] of Object.entries(badgeMap)) {
            if ((flags & bit) === parseInt(bit)) {
                html += `<div style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:4px; background:rgba(255,255,255,0.05); margin-right:4px; border:1px solid rgba(255,255,255,0.1);" title="${info.name}"><i class="fa-solid ${info.icon}" style="color:${info.color}; font-size:10px;"></i></div>`;
            }
        }
        return html;
    }

    function renderTelemetry(data) {
        const statusEl = document.getElementById('discordStatus');
        if (statusEl) {
            const colors = { online: '#22c55e', idle: '#f59e0b', dnd: '#ef4444', offline: '#4b5563' };
            statusEl.style.background = colors[data.discord_status] || colors.offline;
        }
        // Ensure we load the local profil.gif by not overriding the src
        const avatarEl = document.getElementById('profileAvatar');
        // No extra yellow borders applied to the avatar anymore.

        const prefsEl = document.getElementById('discordPrefs');
        if (prefsEl) {
            let html = '';
            

            
            // Custom Status
            const customStatus = data.activities.find(a => a.type === 4);
            if (customStatus) {
                const emoji = customStatus.emoji?.id ? `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.${customStatus.emoji.animated ? 'gif' : 'png'}?size=32" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;">` : (customStatus.emoji?.name ? (customStatus.emoji.name + ' ') : '');
                const text = customStatus.state || '';
                html += `<div class="v8-pref-widget telemetry-card activity-card" style="border-left: 2px solid #ffffff;"><div class="pref-label" style="font-size: 0.7em; color: #fff; margin-bottom: 4px; text-transform: uppercase; font-weight: bold;"><i class="fa-solid fa-comment-dots" style="margin-right: 4px;"></i> STATUS</div><div class="pref-val" style="font-size: 0.9em; font-weight: 500; color: #fff;">${emoji}${text}</div></div>`;
            }
            
            // Spotify
            if (data.spotify) {
                const cover = data.spotify.album_art_url || '';
                html += `<div class="v8-pref-widget telemetry-card spotify-card" style="border-left: 2px solid #1ed760;">
                            <img src="${cover}" style="width: 54px; height: 54px; border-radius: 8px; margin-right: 15px; box-shadow: 0 4px 10px rgba(30, 215, 96, 0.3);">
                            <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <div class="pref-label" style="font-size: 0.7em; color: #fff; margin-bottom: 2px; text-transform: uppercase; font-weight: bold;"><i class="fa-brands fa-spotify" style="margin-right: 4px; color: #1ed760;"></i> LISTENING</div>
                                <div class="pref-val" style="font-weight: 700; font-size: 0.9em; color: #fff; text-overflow: ellipsis; overflow: hidden;">${data.spotify.song}</div>
                                <div style="font-size: 0.75em; color: rgba(255,255,255,0.8); text-overflow: ellipsis; overflow: hidden;">by ${data.spotify.artist}</div>
                            </div>
                        </div>`;
            }
            
            // Playing a Game / Rich Presence
            data.activities.filter(a => a.type === 0).forEach(game => {
                let imgHtml = '';
                if (game.application_id) {
                    const imgUrl = getAssetUrl(game.application_id, game.assets?.large_image);
                    imgHtml = `<img src="${imgUrl}" style="width: 54px; height: 54px; border-radius: 8px; margin-right: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);">`;
                }
                html += `<div class="v8-pref-widget telemetry-card activity-card" style="border-left: 2px solid #ffffff;">
                            ${imgHtml}
                            <div style="flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                <div class="pref-label" style="font-size: 0.7em; color: #fff; margin-bottom: 2px; text-transform: uppercase; font-weight: bold;"><i class="fa-solid fa-gamepad" style="margin-right: 4px; color: #ffffff;"></i> PLAYING</div>
                                <div class="pref-val" style="font-weight: 700; font-size: 0.9em; color: #fff; text-overflow: ellipsis; overflow: hidden;">${game.name}</div>
                                <div style="font-size: 0.75em; color: rgba(255,255,255,0.8); text-overflow: ellipsis; overflow: hidden;">${game.details || ''}</div>
                                <div style="font-size: 0.75em; color: rgba(255,255,255,0.8); text-overflow: ellipsis; overflow: hidden;">${game.state || ''}</div>
                            </div>
                        </div>`;
            });
            
            if (!html) {
                html = `<div class="v8-pref-widget" style="padding: 10px; background: rgba(0,0,0,0.5); border-radius: 8px; text-align: center; border: 1px dashed rgba(255,255,255,0.3);"><div class="pref-label" style="font-size: 0.7em; color: rgba(255,255,255,0.7); margin-bottom: 4px; text-transform: uppercase;"><i class="fa-solid fa-satellite-dish" style="margin-right: 4px;"></i> DISCORD TELEMETRY</div><div class="pref-val"><span style="color: rgba(255,255,255,0.6); font-size: 0.85em;">Offline or Idle</span></div></div>`;
            }
            
            prefsEl.innerHTML = html;
        }
    }

    function applyTypewriter(el, text) {
        el.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }
        type();
    }

    function applyBadges(badges) {
        const wrap = document.getElementById('badgeContainer');
        if (!wrap || !badges.length) return;
        wrap.classList.remove('hidden');
        wrap.innerHTML = badges.map(b => `<div class="badge-item"><i class="fa-solid fa-certificate"></i></div>`).join('');
    }

    function preloadAvatar() {
        // Fallback or early load logic
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
